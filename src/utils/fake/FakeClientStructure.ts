import dayjs from "dayjs";
import {
   type Input,
   array,
   merge,
   number,
   object,
   optional,
   string,
   toMinValue,
} from "valibot";
import { cities, namesTeam } from "../data";
import { getRandomHexColor, getRandomWeightedChoice } from "../functions";
import { VPickListCompassPoints, VRegexDate } from "../types";
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

   createGameGroup = (_input: TInputCreateGameGroup) => {
      const input = valibotParse<TInputCreateGameGroup>({
         schema: VInputCreateGameGroup,
         data: _input,
      });

      const { dateEnd, dateStart, idLeague, name, teams } = input;

      const id = `${idLeague}-${dateStart}-${dateEnd}`;

      const standings = JSON.stringify(
         teams.map((team) => {
            return {
               id: team.id,
               numLosses: 0,
               numTies: 0,
               numWins: 0,
            };
         }),
      );

      return {
         dateEnd,
         dateStart,
         id,
         idLeague,
         name,
         standings,
         teams,
      };
   };

   createGames = (_input: TInputCreateGames) => {
      const { dateEnd, dateStart, numGames, teams } =
         valibotParse<TInputCreateGames>({
            schema: VInputCreateGames,
            data: _input,
         });

      const games: TGame[] = [];

      let currentDate = dayjs(dateStart);
      const endDate = dayjs(dateEnd);

      for (let round = 0; round < numGames; round++) {
         for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
               // Team i plays at home against team j
               games.push({
                  id: `${teams[i].id}-${teams[j].id}-${currentDate.format(
                     "YYYY-MM-DD",
                  )}`,
                  idTeam1: teams[i].id,
                  idTeam2: teams[j].id,
                  date: currentDate.format("YYYY-MM-DD"),
               });
               currentDate = currentDate.add(1, "day");
            }
         }
      }

      return games;
   };

   createTournament = (_input: TInputCreateTournament) => {
      const input = valibotParse<TInputCreateTournament>({
         schema: VInputCreateTournament,
         data: _input,
      });

      return null;
   };

   createLeague = (_input: TInputCreateLeague) => {
      const input = valibotParse<TInputCreateLeague>({
         schema: VInputCreateLeague,
         data: _input,
      });

      const teams: TTeam[] = [];

      const subleagues = input.league.subleagues.map((subleague) => {
         const { divisions, id, name, numTeams } = subleague;

         const divisionsWithCities = this._locateCities({
            divisions,
            numTeams,
         });

         if (divisionsWithCities) {
            const excludeTeamNames: string[] = [];
            const divisionsWithTeams = divisionsWithCities.map(
               (divisionIter) => {
                  const { cities, compassPoint, ...division } = divisionIter;
                  return {
                     ...division,
                     idLeague: id,
                     teams: cities.map((city) => {
                        const teamNamesToChooseFrom = namesTeam.filter(
                           (name) => excludeTeamNames.includes(name) === false,
                        );

                        const teamName =
                           teamNamesToChooseFrom[
                              Math.floor(
                                 Math.random() * teamNamesToChooseFrom.length,
                              )
                           ];

                        excludeTeamNames.push(teamName);

                        const nickname = `${teamName}s`;
                        const idLeague = id;

                        const team = {
                           city,
                           colorPrimary: getRandomHexColor(),
                           colorSecondary: getRandomHexColor(),
                           id: `${idLeague}-${nickname}`,
                           idDivision: division.id,
                           idLeague,
                           nickname,
                        };
                        teams.push(team);

                        return team;
                     }),
                  };
               },
            );

            return {
               divisions: divisionsWithTeams,
               id,
               name,
            };
         }
      });

      return {
         id: input.league.id,
         name: input.league.name,
         subleagues,
         teams,
      };
   };

   _locateCities = (_input: TInputLocateCities) => {
      const input = valibotParse<TInputLocateCities>({
         schema: VInputLocateCities,
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
         const { divisions, numTeams } = input;
         const numMaxTeamsPerDivision = Math.ceil(numTeams / divisions.length);
         const divisionsCompassPointHolder: {
            [K in TDivision["compassPoint"]]: TCity[] | null;
         } = {
            N: null,
            S: null,
            E: null,
            W: null,
            NE: null,
            NW: null,
            SE: null,
            SW: null,
         };

         const divisionsHolder: { [key: string]: TCity[] } = {};

         for (const division of divisions) {
            divisionsCompassPointHolder[division.compassPoint] =
               this._sortCitiesByCompassPoint({
                  cities: citiesToSort,
                  compassPoint: division.compassPoint,
               });

            divisionsHolder[division.compassPoint] = [];
         }

         const matchCityToDivision = ({
            divisions,
            city,
         }: { divisions: TDivision[]; city: TCity }): {
            closestCompassPoint: TDivision["compassPoint"];
         } => {
            const id = city.id;
            let closestCompassPoint: TDivision["compassPoint"] = "N";
            let closestCompassPointDistance = 0;

            for (const division of divisions) {
               const numInDivision =
                  divisionsHolder[division.compassPoint].length;
               const { compassPoint } = division;

               const compassPointCities =
                  divisionsCompassPointHolder[compassPoint];

               if (compassPointCities) {
                  const cityIndex = compassPointCities.findIndex(
                     (city) => city.id === id,
                  );

                  if (numInDivision < numMaxTeamsPerDivision) {
                     if (cityIndex > closestCompassPointDistance) {
                        closestCompassPoint = compassPoint;
                        closestCompassPointDistance = cityIndex;
                     }
                  } else {
                     return matchCityToDivision({
                        divisions: divisions.filter(
                           (division) => division.compassPoint !== compassPoint,
                        ),
                        city,
                     });
                  }
               }
            }

            return {
               closestCompassPoint,
            };
         };

         for (const city of citiesToSort) {
            const { closestCompassPoint } = matchCityToDivision({
               divisions,
               city,
            });

            divisionsHolder[closestCompassPoint].push(city);
         }

         return input.divisions.map((division) => {
            return {
               ...division,
               cities: divisionsHolder[division.compassPoint],
            };
         });
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

      // will return the worst match at the front of the array
      // therefore the northernmost city will be at [array.length - 1] index of the array

      return cities.slice().sort((a, b) => {
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

const VGame = object({
   date: string([VRegexDate]),
   id: string(),
   idTeam1: string(),
   idTeam2: string(),
});
type TGame = Input<typeof VGame>;

const VInputCreateGameGroup = object({
   dateEnd: string([VRegexDate]),
   dateStart: string([VRegexDate]),
   idLeague: string(),
   name: string(),
   teams: array(
      object({
         id: string(),
      }),
   ),
});
type TInputCreateGameGroup = Input<typeof VInputCreateGameGroup>;
const VInputCreateGames = object({
   dateEnd: string([VRegexDate]),
   dateStart: string([VRegexDate]),
   idGameGroup: string(),
   numGames: number([toMinValue(1)]),
   teams: array(
      object({
         city: object({
            latitude: number(),
            longitude: number(),
         }),
         id: string(),
      }),
   ),
});
type TInputCreateGames = Input<typeof VInputCreateGames>;
const VInputCreateTournament = object({});
type TInputCreateTournament = Input<typeof VInputCreateTournament>;

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

const VTeam = object({
   city: VCity,
   colorPrimary: string(),
   colorSecondary: string(),
   id: string(),
   idDivision: string(),
   idLeague: string(),
   nickname: string(),
});
type TTeam = Input<typeof VTeam>;

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
   compassPoint: VPickListCompassPoints,
   id: string(),
   name: string(),
});

type TDivision = Input<typeof VDivision>;

const VDivisions = array(VDivision);

const VSubleague = object({
   divisions: VDivisions,
   id: string(),
   name: string(),
});
type TSubleague = Input<typeof VSubleague>;

const VGeographicLimits = object({
   idCities: optional(array(string())),
   idCountries: optional(array(string())),
   idSubregions: optional(array(string())),
});
type TGeographicLimits = Input<typeof VGeographicLimits>;

const VInputLocateCities = object({
   divisions: optional(VDivisions),
   geographicLimits: optional(VGeographicLimits),
   numTeams: number([toMinValue(2)]),
});
type TInputLocateCities = Input<typeof VInputLocateCities>;

const VInputCreateLeague = object({
   league: object({
      id: string(),
      name: string(),
      subleagues: array(
         merge([
            VSubleague,
            object({
               numTeams: number([toMinValue(2)]),
            }),
         ]),
      ),
   }),
});
type TInputCreateLeague = Input<typeof VInputCreateLeague>;

const VInputConstructor = object({
   geographicLimits: optional(VGeographicLimits),
});
type TInputConstructor = Input<typeof VInputConstructor>;
