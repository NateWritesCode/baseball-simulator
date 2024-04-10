import dayjs from "dayjs";
import { Random } from "random-js";
import { type Input, object, string } from "valibot";
import { type TDbPersonFull, VDbPersonFull, VRegexDate } from "../types";
import { valibotParse } from "../valibot";
const random = new Random(); // uses the nativeMath engine

class SimulatorAge {
   currentHeight: number;
   date: string;
   numDaysOld: number;
   person: TDbPersonFull;

   constructor(_input: TInputConstructor) {
      const { date, person } = valibotParse<TInputConstructor>({
         data: _input,
         schema: VInputConstructor,
      });

      this.date = date;
      this.numDaysOld = dayjs(date).diff(dayjs(person.birthdate), "day");
      this.person = person;
      this.currentHeight = 0;
   }

   _convertToInches(height: number): number {
      return height * (96 / 1000);
   }

   _convertDaysToYearsMonthsDays(_numDays: number): {
      years: number;
      months: number;
      days: number;
   } {
      let numDays = _numDays;
      const years = Math.floor(numDays / 365);
      numDays -= years * 365;
      const months = Math.floor(numDays / 30);
      numDays -= months * 30;
      const days = numDays;

      return { years, months, days };
   }

   simulate() {
      const returnArray: { x: number; y: number }[] = [];

      while (this.numDaysOld < 365 * 100) {
         // simulate until 100 years old
         this.numDaysOld++;

         if (this.numDaysOld % 30 !== 0) {
            // Only simulate every 30 days
            continue;
         }

         // Growth spurt in the first two years
         if (this.numDaysOld <= 365 * 2) {
            this.currentHeight += 5 + random.real(-1, 1); // Increase height by 5 plus some randomness every day
         }
         // Steady growth until age 20
         else if (this.numDaysOld <= 365 * 20) {
            this.currentHeight += 1 + random.real(-0.5, 0.5); // Increase height by 1 plus some randomness every day
         }
         // Gradual decrease in height starting at age 70
         else if (this.numDaysOld > 365 * 70) {
            this.currentHeight -= 0.1 + random.real(-0.05, 0.05); // Decrease height by 0.1 plus some randomness every day
         }

         // Don't exceed potential height
         this.currentHeight = Math.min(
            this.currentHeight,
            this.person.potentialPhysical.height,
         );

         // Ensure height doesn't go below 0
         this.currentHeight = Math.max(this.currentHeight, 0);

         returnArray.push({ x: this.numDaysOld, y: this.currentHeight });
      }

      return returnArray;
   }
}

export default SimulatorAge;

const VInputConstructor = object({
   date: string([VRegexDate]),
   person: VDbPersonFull,
});

type TInputConstructor = Input<typeof VInputConstructor>;
