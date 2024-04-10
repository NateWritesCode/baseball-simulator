import { $ } from "bun";

const pathSvgProcessing = "./src/utils/svg/processing";
const pathInkscapeSvgs = `${pathSvgProcessing}/inkscape-svgs`;
const pathOutput = `${pathSvgProcessing}/output`;
const filenameSvgrConfig = "svgr.config.cjs";
const filenameSvgPerson = "person_inkscape.svg";
const filenameTsxPerson = "GeneratedPerson.tsx";

await $`echo "Getting started on SVG processing!"`;

await $`echo "Processing person svg"`;

const file = Bun.file("./person_inkscape2.svg");

const svgString = await file.text();

const test = svgString
   .replace(/id="[^"]*"/g, `a="b"`)
   .replace(/inkscape:label="([^"]+)"/g, 'id="$1"');

await Bun.write(`${pathOutput}/person_inkscape.svg`, test);

await $`bunx svgr --config-file=${pathSvgProcessing}/${filenameSvgrConfig} -- ${pathInkscapeSvgs}/${filenameSvgPerson} > ${pathOutput}/${filenameTsxPerson}`;

await $`echo "Finished SVG processing!"`;
