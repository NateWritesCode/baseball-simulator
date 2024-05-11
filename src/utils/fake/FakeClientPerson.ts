import { type Input, number, object, parse } from "valibot";
import { MAX_PERSON_RATING, MIN_PERSON_RATING } from "../constants";
import {
   cities,
   namesFirstFemale,
   namesFirstFemaleWeights,
   namesFirstMale,
   namesFirstMaleWeights,
   namesLast,
   namesLastWeights,
} from "../data";
import {
   getRandom0or1,
   getRandomBoxMullerTransform,
   getRandomNumberBetweenInclusive,
   kebabCase,
} from "../functions";
import {
   type TPickListGenderSetting,
   VPickListGenderCis,
   VPickListGenderSetting,
} from "../types";

class FakeClient {
   _genderSetting: TPickListGenderSetting;

   constructor(_input: TInputConstructor) {
      const { genderSetting } = parse(VInputConstructor, _input);
      this._genderSetting = genderSetting;
   }

   public fakePerson = () => {
      const birthdate = new Date().toISOString().split("T")[0];
      const idBirthplace = this._pickElementFromArrayWithWeight({
         array: cities,
         weights: cities.map((city) => city.population),
      }).id;

      const lastName = this._pickElementFromArrayWithWeight({
         array: namesLast,
         weights: namesLastWeights,
      });

      const genderCis = getRandom0or1({ weight: 0.5 }) ? "m" : "f";
      const genderIdentity = (() => {
         switch (this._genderSetting) {
            case "traditional": {
               return genderCis;
            }
            case "modern": {
               return getRandom0or1({ weight: 0.9 }) ? "nb" : genderCis;
            }
            default: {
               const exhaustiveCheck: never = this._genderSetting;
               throw new Error(exhaustiveCheck);
            }
         }
      })();

      const firstName = (() => {
         const [firstNames, firstNameWeights] = (() => {
            switch (genderIdentity) {
               case "m": {
                  return [namesFirstMale, namesFirstMaleWeights];
               }
               case "f": {
                  return [namesFirstFemale, namesFirstFemaleWeights];
               }
               case "nb": {
                  return [
                     [...namesFirstMale, ...namesFirstFemale],
                     [...namesFirstMaleWeights, ...namesFirstFemaleWeights],
                  ];
               }
               default: {
                  const exhaustiveCheck: never = genderIdentity;
                  throw new Error(exhaustiveCheck);
               }
            }
         })();

         return this._pickElementFromArrayWithWeight({
            array: firstNames,
            weights: firstNameWeights,
         });
      })();

      // const id = kebabCase(`${firstName} ${lastName}`);
      const myersBriggs = this._myersBriggs({ genderCis });
      const alignment = this._alignment();
      const currentPhysical = this._currentPhysical();
      const potentialPhysical = this._potentialPhysical();
      const currentSkillMental = this._currentSkillMental();
      const potentialSkillMental = this._potentialSkillMental();
      const currentSkillPhysical = this._currentSkillPhysical();
      const potentialSkillPhysical = this._potentialSkillPhysical();
      const health = this._health();

      return {
         alignment,
         birthdate,
         currentPhysical,
         currentSkillMental,
         currentSkillPhysical,
         firstName,
         genderCis,
         genderIdentity,
         health,
         // id,
         idBirthplace,
         lastName,
         myersBriggs,
         potentialPhysical,
         potentialSkillMental,
         potentialSkillPhysical,
      };
   };

   private _alignment = () => {
      const [chaotic, neutralOrder, lawful] = this._alignmentNums();
      const [good, neutralMorality, evil] = this._alignmentNums();

      return {
         chaotic,
         evil,
         good,
         lawful,
         neutralMorality,
         neutralOrder,
      };
   };
   private _alignmentNums = () => {
      // https://math.stackexchange.com/questions/1276206/method-of-generating-random-numbers-that-sum-to-100-is-this-truly-random

      const num1 = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });
      const num2 = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });
      const num3 = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });

      const numArray = [num1, num2, num3].sort((a, b) => a - b);

      const trait1 = numArray[1] - numArray[0];
      const trait2 = numArray[2] - numArray[1];
      const trait3 = MAX_PERSON_RATING + numArray[0] - numArray[2];

      return [trait1, trait2, trait3];
   };

   private _health = () => {
      const health = {
         arms: {
            left: MAX_PERSON_RATING,
            right: MAX_PERSON_RATING,
         },
         brain: MAX_PERSON_RATING,
         calves: {
            left: MAX_PERSON_RATING,
            right: MAX_PERSON_RATING,
         },
         ears: {
            left: MAX_PERSON_RATING,
            right: MAX_PERSON_RATING,
         },
         elbows: {
            left: MAX_PERSON_RATING,
            right: MAX_PERSON_RATING,
         },
         eyes: {
            left: MAX_PERSON_RATING,
            right: MAX_PERSON_RATING,
         },
         fingers: {
            left: {
               index: MAX_PERSON_RATING,
               middle: MAX_PERSON_RATING,
               ring: MAX_PERSON_RATING,
               pinky: MAX_PERSON_RATING,
               thumb: MAX_PERSON_RATING,
            },
            right: {
               index: MAX_PERSON_RATING,
               middle: MAX_PERSON_RATING,
               ring: MAX_PERSON_RATING,
               pinky: MAX_PERSON_RATING,
               thumb: MAX_PERSON_RATING,
            },
         },
         hamstrings: {
            left: MAX_PERSON_RATING,
            right: MAX_PERSON_RATING,
         },
         hands: {
            left: MAX_PERSON_RATING,
            right: MAX_PERSON_RATING,
         },
         head: MAX_PERSON_RATING,
         heart: MAX_PERSON_RATING,
         intestines: MAX_PERSON_RATING,
         kidneys: {
            left: MAX_PERSON_RATING,
            right: MAX_PERSON_RATING,
         },
         liver: MAX_PERSON_RATING,
         lungs: {
            left: MAX_PERSON_RATING,
            right: MAX_PERSON_RATING,
         },
         nose: MAX_PERSON_RATING,
         quads: {
            left: MAX_PERSON_RATING,
            right: MAX_PERSON_RATING,
         },
         reproductive: MAX_PERSON_RATING,
         shoulders: {
            left: MAX_PERSON_RATING,
            right: MAX_PERSON_RATING,
         },
         spleen: MAX_PERSON_RATING,
         stomach: MAX_PERSON_RATING,
         teeth: MAX_PERSON_RATING,
         toes: {
            left: {
               big: MAX_PERSON_RATING,
               index: MAX_PERSON_RATING,
               middle: MAX_PERSON_RATING,
               ring: MAX_PERSON_RATING,
               pinky: MAX_PERSON_RATING,
            },
            right: {
               big: MAX_PERSON_RATING,
               index: MAX_PERSON_RATING,
               middle: MAX_PERSON_RATING,
               ring: MAX_PERSON_RATING,
               pinky: MAX_PERSON_RATING,
            },
         },
         tongue: MAX_PERSON_RATING,
      };

      return health;
   };

   private _myersBriggs = (_input: TInputMyersBriggs) => {
      const { genderCis } = parse(VInputMyersBriggs, _input);

      // https://personalitymax.com/personality-types/population-gender/
      // E: Male - 45.9, Female - 52.6
      // I: Male - 54.1, Female - 47.4
      const [extroversion, introversion] = this._myersBriggsValue({
         weight: (() => {
            switch (this._genderSetting) {
               case "traditional": {
                  return genderCis === "m" ? 0.459 : 0.526;
               }
               case "modern": {
                  return 0.5;
               }
               default: {
                  const exhaustiveCheck: never = this._genderSetting;
                  throw new Error(exhaustiveCheck);
               }
            }
         })(),
      });

      // S: Male - 71.9, Female - 74.9
      // N: Male - 28.1, Female - 25.1
      const [sensing, intuition] = this._myersBriggsValue({
         weight: (() => {
            switch (this._genderSetting) {
               case "traditional": {
                  return genderCis === "m" ? 0.719 : 0.749;
               }
               case "modern": {
                  return 0.5;
               }
               default: {
                  const exhaustiveCheck: never = this._genderSetting;
                  throw new Error(exhaustiveCheck);
               }
            }
         })(),
      });

      // T: Male - 56.5, Female - 24.4
      // F: Male - 43.5, Female - 75.6
      const [thinking, feeling] = this._myersBriggsValue({
         weight: (() => {
            switch (this._genderSetting) {
               case "traditional": {
                  return genderCis === "m" ? 0.565 : 0.244;
               }
               case "modern": {
                  return 0.5;
               }
               default: {
                  const exhaustiveCheck: never = this._genderSetting;
                  throw new Error(exhaustiveCheck);
               }
            }
         })(),
      });

      // J: Male - 52, Female - 56.2
      // P: Male - 48, Female - 43.8
      const [judging, perceiving] = this._myersBriggsValue({
         weight: (() => {
            switch (this._genderSetting) {
               case "traditional": {
                  return genderCis === "m" ? 0.52 : 0.562;
               }
               case "modern": {
                  return 0.5;
               }
               default: {
                  const exhaustiveCheck: never = this._genderSetting;
                  throw new Error(exhaustiveCheck);
               }
            }
         })(),
      });

      return {
         extroversion,
         introversion,
         sensing,
         intuition,
         thinking,
         feeling,
         judging,
         perceiving,
      };
   };

   private _myersBriggsValue = (_input: TInputMyersBriggsValue) => {
      const { weight } = parse(VInputMyersBriggsValue, _input);
      const isFirstTrait = getRandom0or1({ weight });
      const firstTrait = isFirstTrait
         ? getRandomBoxMullerTransform({
              min: MAX_PERSON_RATING / 2,
              max: MAX_PERSON_RATING,
              skew: 1,
           })
         : getRandomBoxMullerTransform({
              min: MIN_PERSON_RATING,
              max: MAX_PERSON_RATING / 2,
              skew: 1,
           });
      const secondTrait = MAX_PERSON_RATING - firstTrait;

      return [firstTrait, secondTrait];
   };

   private _currentPhysical = () => {
      const height = 0;
      const weight = 0;

      return {
         height,
         weight,
      };
   };

   private _potentialPhysical = () => {
      const height = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });

      const weight = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });

      return {
         height,
         weight,
      };
   };

   private _pickElementFromArrayWithWeight = <T>({
      array,
      weights,
   }: { array: T[]; weights: number[] }): T => {
      if (Array.isArray(array) && Array.isArray(weights)) {
         if (array.length !== weights.length) {
            throw new Error("Array and weights must be the same length");
         }

         const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
         const randomNum = Math.random() * totalWeight;

         let weightSum = 0;
         for (let i = 0; i < array.length; i++) {
            weightSum += weights[i];
            if (randomNum <= weightSum) {
               return array[i];
            }
         }
      }

      throw new Error("Can't pick from there arrays");
   };

   private _currentSkillMental = () => {
      const charisma = 0;
      const constitution = 0;
      const intelligence = 0;
      const loyalty = 0;
      const wisdom = 0;
      const workEthic = 0;

      return {
         charisma,
         constitution,
         intelligence,
         loyalty,
         wisdom,
         workEthic,
      };
   };

   private _potentialSkillMental = () => {
      const charisma = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });
      const constitution = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });
      const intelligence = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });
      const loyalty = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });
      const wisdom = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });
      const workEthic = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });

      return {
         charisma,
         constitution,
         intelligence,
         loyalty,
         wisdom,
         workEthic,
      };
   };

   private _currentSkillPhysical = () => {
      const dexterity = 0;
      const strength = 0;
      return {
         dexterity,
         strength,
      };
   };

   private _potentialSkillPhysical = () => {
      const dexterity = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });
      const strength = getRandomNumberBetweenInclusive({
         min: MIN_PERSON_RATING,
         max: MAX_PERSON_RATING,
      });

      return {
         dexterity,
         strength,
      };
   };
}

export default FakeClient;

const VInputConstructor = object({
   genderSetting: VPickListGenderSetting,
});
type TInputConstructor = Input<typeof VInputConstructor>;

const VInputMyersBriggs = object({
   genderCis: VPickListGenderCis,
});
type TInputMyersBriggs = Input<typeof VInputMyersBriggs>;

const VInputMyersBriggsValue = object({
   weight: number(),
});
type TInputMyersBriggsValue = Input<typeof VInputMyersBriggsValue>;
