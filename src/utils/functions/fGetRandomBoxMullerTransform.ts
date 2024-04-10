import { type Input, number, object, parse } from "valibot";

const VInput = object({
   min: number(),
   max: number(),
   skew: number(),
});
type TInput = Input<typeof VInput>;

const getRandomBoxMullerTransform = (_input: TInput) => {
   const { min, max, skew } = parse(VInput, _input);

   // https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
   let u = 0;
   let v = 0;
   while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
   while (v === 0) v = Math.random();
   let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

   num = num / 10.0 + 0.5; // Translate to 0 -> 1
   if (num > 1 || num < 0)
      num = getRandomBoxMullerTransform({ min, max, skew });
   // resample between 0 and 1 if out of range
   else {
      num = num ** skew; // Skew
      num *= max - min; // Stretch to fill range
      num += min; // offset to min
   }

   return Math.round(num);
};

export default getRandomBoxMullerTransform;
