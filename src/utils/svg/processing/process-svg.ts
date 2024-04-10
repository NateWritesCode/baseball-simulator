import { Window } from "happy-dom";

const gatherAttributes = ({
   attributes,
   attributesToKeep,
   attributesToExclude,
}: {
   attributes: NamedNodeMap;
   attributesToKeep?: string[];
   attributesToExclude?: string[];
}) => {
   const returnAttributes: Attr[] = [];

   for (const attribute of attributes) {
      if (attributesToKeep) {
         if (attributesToKeep.includes(attribute.name)) {
            returnAttributes.push(attribute);
         }

         continue;
      }

      if (attributesToExclude) {
         const { name } = attribute;

         const containsAny = attributesToExclude.some((attributeName) => {
            return name.includes(attributeName);
         });

         if (containsAny) {
            continue;
         }
      }

      returnAttributes.push(attribute);
   }

   return returnAttributes;
};

function prettyPrintHTML(html: string, indentSize = 2): string {
   let indent = "";
   return html
      .replace(/></g, ">\n<")
      .split("\n")
      .map((line) => {
         let newIndent = indent;
         if (line.startsWith("</")) {
            indent = indent.slice(indentSize);
         } else if (line.endsWith(">")) {
            newIndent = indent;
            if (
               !line.startsWith("<meta") &&
               !line.startsWith("<link") &&
               !line.startsWith("<img")
            ) {
               indent += " ".repeat(indentSize);
            }
         }
         return newIndent + line;
      })
      .join("\n");
}

function convertStyleStringToReactStyleObject(
   styleString: string | null,
): React.CSSProperties {
   if (!styleString) {
      return {};
   }

   const styleObject: any = {};
   const styleDeclarations = styleString.split(";");

   for (const declaration of styleDeclarations) {
      const [property, value] = declaration.split(":");

      if (property && value) {
         const formattedProperty = property
            .trim()
            .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
         styleObject[formattedProperty] = value.trim();
      }
   }

   return styleObject;
}

(async () => {
   const svgText = await Bun.file(
      "src/utils/svg/processing/inkscape-svgs/my_person.svg",
   ).text();

   const window = new Window();

   const document = window.document;

   const div = document.createElement("div");
   div.innerHTML = svgText;

   const svg = div.querySelector("svg");

   const newSvg = document.createElement("svg");

   if (svg) {
      //   Handle svg attributes

      if (svg.attributes) {
         const attributes = gatherAttributes({
            attributes: svg.attributes as unknown as NamedNodeMap,
            attributesToKeep: ["viewBox", "version"],
         });

         for (const attribute of attributes) {
            newSvg.setAttribute(attribute.name, attribute.value);
         }

         const sodipodiElement: Element | null | undefined =
            svg.getElementsByTagName("sodipodi")[0];

         if (sodipodiElement) {
            for (const child of sodipodiElement.children) {
               const { tagName } = child;

               if (tagName === "defs") {
                  const defs = document.createElement("defs");
                  for (const defsChild of child.children) {
                     const tagName = defsChild.tagName;

                     if (tagName !== "inkscape") {
                        const newElement = document.createElement(tagName);

                        const attributes = gatherAttributes({
                           attributes:
                              defsChild.attributes as unknown as NamedNodeMap,
                           attributesToExclude: ["inkscape"],
                        });

                        for (const attribute of attributes) {
                           newElement.setAttribute(
                              attribute.name,
                              attribute.value,
                           );
                        }

                        const children = defsChild.children;

                        for (const child of children) {
                           const newChild = document.createElement(
                              child.tagName,
                           );

                           const childAttributes = gatherAttributes({
                              attributes:
                                 child.attributes as unknown as NamedNodeMap,
                           });

                           for (const attribute of childAttributes) {
                              newChild.setAttribute(
                                 attribute.name,
                                 attribute.value,
                              );
                           }

                           newElement.appendChild(newChild);
                        }

                        defs.appendChild(newElement);
                     }
                  }
                  newSvg.appendChild(defs);
               }

               if (tagName === "g") {
                  const newG = document.createElement("g");
                  const gId = child.getAttribute("id");
                  const gInkscapeLabel = child.getAttribute("inkscape:label");

                  const attributes = gatherAttributes({
                     attributes: child.attributes as unknown as NamedNodeMap,
                     attributesToKeep: ["style"],
                  });

                  for (const attribute of attributes) {
                     newG.setAttribute(attribute.name, attribute.value);
                  }

                  newG.setAttribute("id", gInkscapeLabel || gId || "");

                  for (const gChild of child.children) {
                     const gChildId = gChild.getAttribute("id");
                     const gChildInkscapeLabel =
                        gChild.getAttribute("inkscape:label");
                     const newElement = document.createElement(gChild.tagName);

                     const attributes = gatherAttributes({
                        attributes:
                           gChild.attributes as unknown as NamedNodeMap,
                        attributesToKeep: ["d", "style"],
                     });

                     for (const attribute of attributes) {
                        newElement.setAttribute(
                           attribute.name,
                           attribute.value,
                        );
                     }

                     newElement.setAttribute(
                        "id",
                        gChildInkscapeLabel || gChildId || "",
                     );

                     newG.appendChild(newElement);
                  }

                  newSvg.appendChild(newG);
               }
            }
         }
      }
   }

   // console.log(prettyPrintHTML(newSvg.outerHTML));

   await Bun.write(
      "src/utils/svg/processing/inkscape-svgs/tacos.svg",
      newSvg.outerHTML.toString(),
   );
})();
