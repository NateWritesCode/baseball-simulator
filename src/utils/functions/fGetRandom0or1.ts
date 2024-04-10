import { type Input, number, object, optional, parse } from "valibot";

const VInput = optional(
   object({
      weight: optional(number()),
   }),
);
type TInput = Input<typeof VInput>;

export default (_input?: TInput) => {
   const input = parse(VInput, _input);

   const weight = input?.weight;

   // Weight goes to likelihood of returning 0, so 0.3 means 30% chance of returning 0
   // If weight is not provided, it defaults to 0.5, which means 50% chance of returning 0
   if (weight && (weight <= 0 || weight >= 1)) {
      throw new Error("Weight must be between 0 and 1");
   }

   return Math.random() < (weight || 0.5) ? 0 : 1;
};
