/** @type {import("@svgr/core").Config} */
module.exports = {
   jsxRuntime: "automatic",
   typescript: true,
   svgoConfig: {
      plugins: [
         "removeDimensions",
         {
            name: "preset-default",
            params: {
               overrides: {
                  cleanupIds: false,
                  removeViewBox: false,
               },
            },
         },
      ],
   },
};
