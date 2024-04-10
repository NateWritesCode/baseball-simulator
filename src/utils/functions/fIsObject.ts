export default (o: unknown) =>
   o !== null && typeof o === "object" && !Array.isArray(o);
