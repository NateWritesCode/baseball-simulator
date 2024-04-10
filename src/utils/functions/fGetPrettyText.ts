export default (s: string) => {
   return s
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim()
      .replace(/([a-z])([A-Z])/g, "$1 $2");
};
