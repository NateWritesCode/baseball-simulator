import {
   type Input,
   array,
   boolean,
   number,
   object,
   optional,
   string,
   toMinValue,
} from "valibot";
import cities from "../data/cities.json";
import { VPickListCompassPoints } from "../types";
import { valibotParse } from "../valibot";

class FakeClientStructure {
   geographicLimits?: TInputConstructor["geographicLimits"];

   constructor(_input: TInputConstructor) {
      const input = valibotParse<TInputConstructor>({
         schema: VInputConstructor,
         data: _input,
      });

      if (input.geographicLimits) {
         this.geographicLimits = input.geographicLimits;
      }
   }

   createLeagues = (_input: TInputCreateLeagues) => {
      const input = valibotParse<TInputCreateLeagues>({
         schema: VInputCreateLeagues,
         data: _input,
      });

      return {
         leagues: input.leagues.map((league) => {
            const { divisions, id, name } = league;

            const returnObj = {
               divisions,
               id,
               name,
            };

            if (divisions) {
               this.locateTeams();
            }

            // return {
            //    ...league,
            //    divisions: league.divisions.map((division) => {
            //       return {
            //          ...division,
            //          compassPoint: division.compassPoint || "N",
            //       };
            //    }),
            // };
         }),
      };
   };

   createTeam = () => {};

   locateTeams = (_input: TInputLocateTeams) => {
      const input = valibotParse<TInputLocateTeams>({
         schema: VInputLocateTeams,
         data: _input,
      });

      const geographicLimits = input?.geographicLimits || this.geographicLimits;

      const citiesToChoose = geographicLimits
         ? cities.filter((city) => {
              const geographicLimit = Object.fromEntries(
                 Object.entries(geographicLimits).filter(
                    ([_, value]) => value !== undefined && value !== null,
                 ),
              );

              let isMatch = true;

              const keysGeographicLimit = Object.keys(geographicLimit);

              for (let i = 0; i < keysGeographicLimit.length; i++) {
                 const keyGeographicLimit = keysGeographicLimit[
                    i
                 ] as keyof TGeographicLimits;

                 const matchKey = (() => {
                    switch (keyGeographicLimit) {
                       case "idCities": {
                          return "id";
                       }
                       case "idSubregions": {
                          return "idSubregion";
                       }
                       case "idCountries": {
                          return "idCountry";
                       }
                       default: {
                          const exhaustiveCheck: never = keyGeographicLimit;
                          throw new Error(exhaustiveCheck);
                       }
                    }
                 })();

                 const valueGeographicLimit =
                    geographicLimit[keyGeographicLimit];

                 if (valueGeographicLimit.includes(city[matchKey]) === false) {
                    isMatch = false;
                    break;
                 }
              }

              return isMatch;
           })
         : cities;
   };
}

export default FakeClientStructure;

const VDivision = object({
   compassPoint: optional(VPickListCompassPoints),
   id: string(),
   name: string(),
});

const VDivisions = array(VDivision);

const VGeographicLimits = object({
   idCities: optional(array(string())),
   idCountries: optional(array(string())),
   idSubregions: optional(array(string())),
});
type TGeographicLimits = Input<typeof VGeographicLimits>;

const VInputCreateTeam = object({
   excludeNames: optional(array(string())),
   idCity: string(),
});

const VInputLocateTeams = optional(
   object({
      geographicLimits: optional(VGeographicLimits),
      numTeams: number([toMinValue(2)]),
   }),
);
type TInputLocateTeams = Input<typeof VInputLocateTeams>;

const VInputCreateLeagues = object({
   leagues: array(
      object({
         divisions: optional(VDivisions),
         id: string(),
         name: string(),
      }),
   ),
});
type TInputCreateLeagues = Input<typeof VInputCreateLeagues>;

const VInputConstructor = object({
   geographicLimits: optional(VGeographicLimits),
});
type TInputConstructor = Input<typeof VInputConstructor>;
