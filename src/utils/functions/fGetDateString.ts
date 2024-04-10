export default (d: Date) => {
   // Returns a string in the format "YYYY-MM-DD"
   return d.toISOString().split("T")[0];
};
