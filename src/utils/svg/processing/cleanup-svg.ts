(async () => {
   const file = Bun.file("./my_person.svg");

   const svgString = await file.text();

   const test = svgString
      .replace(/id="[^"]*"/g, `a="b"`)
      .replace(/inkscape:label="([^"]+)"/g, 'id="$1"');

   await Bun.write("./my_person_export.svg", test);
})();
