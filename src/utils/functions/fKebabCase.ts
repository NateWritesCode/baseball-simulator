import { parse, string } from "valibot";

// kebabCase("FooBar") => "foo-bar"
export default (_s: string) => {
   const s = parse(string(), _s);

   return s
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-zA-Z0-9-]+/g, "") // Replace non-alphanumeric characters with nothing
      .toLowerCase();
};
