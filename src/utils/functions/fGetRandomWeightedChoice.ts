import { type Input, any, array, number, object, parse, tuple } from "valibot";

const getRandomWeightedChoice = <T>(_input: TInput): T => {
   const { data } = parse(VInput, _input);

   let total = 0;
   for (let i = 0; i < data.length; ++i) {
      total += data[i][1];
   }
   const threshold = Math.random() * total;

   total = 0;
   for (let i = 0; i < data.length - 1; ++i) {
      total += data[i][1];

      if (total >= threshold) {
         return data[i][0];
      }
   }

   return data[data.length - 1][0];
};

export default getRandomWeightedChoice;

const VInput = object({
   data: array(tuple([any(), number()])),
});

type TInput = Input<typeof VInput>;
