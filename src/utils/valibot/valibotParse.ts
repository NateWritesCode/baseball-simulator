import { type BaseSchema, ValiError, flatten, parse } from "valibot";

const valibotParse = <T>(_input: { schema: BaseSchema; data: unknown }) => {
   const { schema, data } = _input;
   if (process.env.NODE_ENV === "production") data as T;

   try {
      const parsedData = parse(schema, data);

      return parsedData as T;
   } catch (error: unknown) {
      if (error instanceof ValiError) {
         const { nested } = flatten(error);

         const errors = Object.keys(nested).map((key) => {
            return `${key}: ${nested[key]?.join(", ")}`;
         });

         const errorLocation = error.stack?.split("\n")[3];

         console.info("Unsuccessful validation data", data);

         throw new Error(
            `${
               errorLocation ? `Error ${errorLocation.trim()}\n` : ""
            }Validation failed for ${schema.type}\n${errors.join("\n")}`,
         );
      }

      console.error(error);
   }
   throw new Error("Validation error");
};

export default valibotParse;
