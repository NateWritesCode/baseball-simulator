import { type Input, number, object, parse } from "valibot";

const VInput = object({
   min: number(),
   max: number(),
});
type TInput = Input<typeof VInput>;

export default (_input: TInput) => {
   const { min, max } = parse(VInput, _input);

   return Math.floor(Math.random() * (max - min + 1)) + min;
};
