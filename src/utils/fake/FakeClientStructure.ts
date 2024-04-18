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
import { getRandomWeightedChoice } from "../functions";
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
            const { divisions, id, name, numTeams } = league;

            const returnObj = {
               divisions,
               id,
               name,
            };

            if (divisions) {
               this.locateTeams({
                  divisions,
                  numTeams,
               });
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

      let citiesToSort = geographicLimits
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

      if (input.numTeams !== citiesToSort.length) {
         citiesToSort = this._chooseCitiesWithPopulationFactor({
            cities: citiesToSort,
            numTeams: input.numTeams,
         });
      }

      if (input.divisions) {
      }
   };

   _chooseCitiesWithPopulationFactor = (
      _input: TInputChooseCitiesWithPopulationFactor,
   ) => {
      const input = valibotParse<TInputChooseCitiesWithPopulationFactor>({
         schema: VInputChooseCitiesWithPopulationFactor,
         data: _input,
      });

      const { cities } = input;

      const returnCities = [];
      let citiesToPickFrom = cities.slice();

      while (returnCities.length < input.numTeams) {
         const numPopulationTotal = citiesToPickFrom.reduce((acc, city) => {
            return acc + city.population;
         }, 0);

         const citiesWithPopulationFactor = citiesToPickFrom.map((city) => {
            return [city, city.population / numPopulationTotal] as [
               typeof city,
               number,
            ];
         });

         const chosenCity = getRandomWeightedChoice<TCity>({
            data: citiesWithPopulationFactor,
         });

         returnCities.push(chosenCity);

         citiesToPickFrom = citiesToPickFrom.filter(
            (city) => city.id !== chosenCity.id,
         );
      }

      return returnCities;
   };

   _sortCitiesByCompassPoint = (_input: TInputSortCitiesByCompassPoint) => {
      const input = valibotParse<TInputSortCitiesByCompassPoint>({
         schema: VInputSortCitiesByCompassPoint,
         data: _input,
      });

      const { cities, compassPoint } = input;

      return cities.sort((a, b) => {
         switch (compassPoint) {
            case "N":
               return a.latitude - b.latitude;
            case "S":
               return b.latitude - a.latitude;
            case "E":
               return a.longitude - b.longitude;
            case "W":
               return b.longitude - a.longitude;
            case "NE":
               return a.latitude + a.longitude - (b.latitude + b.longitude);
            case "NW":
               return a.latitude - a.longitude - (b.latitude - b.longitude);
            case "SE":
               return b.latitude - a.latitude + (a.longitude - b.longitude);
            case "SW":
               return b.latitude - a.latitude + (b.longitude - a.longitude);
            default:
               return 0;
         }
      });
   };
}

export default FakeClientStructure;

const VCity = object({
   id: string(),
   idCountry: string(),
   idSubregion: string(),
   latitude: number(),
   longitude: number(),
   name: string(),
   population: number(),
});
type TCity = Input<typeof VCity>;

const VInputChooseCitiesWithPopulationFactor = object({
   cities: array(VCity),
   numTeams: number([toMinValue(2)]),
});
type TInputChooseCitiesWithPopulationFactor = Input<
   typeof VInputChooseCitiesWithPopulationFactor
>;

const VInputSortCitiesByCompassPoint = object({
   cities: array(VCity),
   compassPoint: VPickListCompassPoints,
});
type TInputSortCitiesByCompassPoint = Input<
   typeof VInputSortCitiesByCompassPoint
>;

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
   divisions: optional(VDivisions),
   excludeNames: optional(array(string())),
   idCity: string(),
});

const VInputLocateTeams = object({
   divisions: optional(VDivisions),
   geographicLimits: optional(VGeographicLimits),
   numTeams: number([toMinValue(2)]),
});
type TInputLocateTeams = Input<typeof VInputLocateTeams>;

const VInputCreateLeagues = object({
   leagues: array(
      object({
         divisions: optional(VDivisions),
         id: string(),
         name: string(),
         numTeams: number([toMinValue(2)]),
      }),
   ),
});
type TInputCreateLeagues = Input<typeof VInputCreateLeagues>;

const VInputConstructor = object({
   geographicLimits: optional(VGeographicLimits),
});
type TInputConstructor = Input<typeof VInputConstructor>;
