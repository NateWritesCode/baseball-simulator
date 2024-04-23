import dayjs from "dayjs";
import type { Store } from "tinybase";
import {
   type IndexedDbPersister,
   createIndexedDbPersister,
} from "tinybase/persisters/persister-indexed-db";
import { createQueries, createStore } from "tinybase/with-schemas";
import {
   type Input,
   array,
   merge,
   number,
   object,
   omit,
   pick,
   string,
} from "valibot";
import { cities, countries, subregions } from "../data";
import { FakeClientPerson, FakeClientStructure } from "../fake";
import { getDateString, isObject } from "../functions";
import {
   VDbCity,
   VDbCountry,
   VDbPerson,
   VDbPersonAlignment,
   VDbPersonFull,
   VDbPersonMyersBriggs,
   VDbPersonPhysical,
   VDbPersonSkillMental,
   VDbPersonSkillPhysical,
   VDbSubregion,
} from "../types";
import { valibotParse } from "../valibot";

class DbClient {
   private fakeClientPerson = new FakeClientPerson({
      genderSetting: "traditional",
   });
   private fakeClientStructure = new FakeClientStructure({
      geographicLimits: {
         idSubregions: ["illinois-united-states"],
      },
   });

   public name: string;

   public store = createStore().setTablesSchema({
      cities: {
         id: { type: "string" },
         idCountry: { type: "string" },
         idSubregion: { type: "string" },
         name: { type: "string" },
         population: { type: "number" },
      },
      countries: {
         id: { type: "string" },
         code: { type: "string" },
         name: { type: "string" },
      },
      divisions: {
         id: { type: "string" },
         idLeague: { type: "string" },
         idSubleague: { type: "string" },
         name: { type: "string" },
      },
      games: {
         date: { type: "string" },
         id: { type: "string" },
         idGameGroup: { type: "string" },
         idTeam1: { type: "string" },
         idTeam2: { type: "string" },
      },
      gameGroups: {
         dateEnd: { type: "string" },
         dateStart: { type: "string" },
         id: { type: "string" },
         idLeague: { type: "string" },
         name: { type: "string" },
         standings: { type: "string" },
      },
      leagues: {
         id: { type: "string" },
         name: { type: "string" },
      },
      persons: {
         id: { type: "string" },
         idBirthplace: { type: "string" },
         birthdate: { type: "string" },
         firstName: { type: "string" },
         genderCis: { type: "string" },
         genderIdentity: { type: "string" },
         lastName: { type: "string" },
      },
      personsAlignment: {
         id: { type: "string" },
         chaotic: { type: "number" },
         evil: { type: "number" },
         good: { type: "number" },
         lawful: { type: "number" },
         neutralMorality: { type: "number" },
         neutralOrder: { type: "number" },
      },
      personsMyersBriggs: {
         id: { type: "string" },
         extroversion: { type: "number" },
         feeling: { type: "number" },
         introversion: { type: "number" },
         intuition: { type: "number" },
         judging: { type: "number" },
         perceiving: { type: "number" },
         sensing: { type: "number" },
         thinking: { type: "number" },
      },
      personsCurrentSkillMental: {
         id: { type: "string" },
         charisma: { type: "number" },
         constitution: { type: "number" },
         intelligence: { type: "number" },
         loyalty: { type: "number" },
         wisdom: { type: "number" },
         workEthic: { type: "number" },
      },
      personsCurrentSkillPhysical: {
         id: { type: "string" },
         dexterity: { type: "number" },
         strength: { type: "number" },
      },
      personsCurrentPhysical: {
         id: { type: "string" },
         height: { type: "number" },
         weight: { type: "number" },
      },
      personsPotentialSkillMental: {
         id: { type: "string" },
         charisma: { type: "number" },
         constitution: { type: "number" },
         intelligence: { type: "number" },
         loyalty: { type: "number" },
         wisdom: { type: "number" },
         workEthic: { type: "number" },
      },
      personsPotentialSkillPhysical: {
         id: { type: "string" },
         dexterity: { type: "number" },
         strength: { type: "number" },
      },
      personsPotentialPhysical: {
         id: { type: "string" },
         height: { type: "number" },
         weight: { type: "number" },
      },
      personsHealth: {
         id: { type: "string" },
         health: { type: "string" },
      },
      simulation: {
         date: { type: "string" },
         id: { type: "string" },
         name: { type: "string" },
      },
      subleagues: {
         id: { type: "string" },
         idLeague: { type: "string" },
      },
      subregions: {
         id: { type: "string" },
         idCountry: { type: "string" },
         abbrev: { type: "string" },
         name: { type: "string" },
      },
      teams: {
         colorPrimary: { type: "string" },
         colorSecondary: { type: "string" },
         id: { type: "string" },
         idCity: { type: "string" },
         idDivision: { type: "string" },
         idLeague: { type: "string" },
         nickname: { type: "string" },
      },
      tournaments: {
         id: { type: "string" },
         idGameGroup: { type: "string" },
         name: { type: "string" },
      },
   });

   public queries = createQueries(this.store);

   private persister: IndexedDbPersister;

   constructor(_input: TInputConstructor) {
      const { name } = valibotParse<TInputConstructor>({
         schema: VInputConstructor,
         data: _input,
      });

      this.persister = createIndexedDbPersister(this.store as Store, name);
      this._setQueries();
      this.name = name;
   }

   public async init() {
      await this.persister.startAutoLoad();
      await this.persister.startAutoSave();

      if (this.queries.getResultRowCount("persons") === 0) {
         this._seed();
      }
   }

   private _setQueries() {
      this.queries.setQueryDefinition(
         "cities",
         "cities",
         ({ select, join }) => {
            select("id");
            select("name");
            select("population");
            select("subregion", "abbrev").as("subregion.abbrev");
            select("subregion", "id").as("subregion.id");
            select("subregion", "name").as("subregion.name");
            select("country", "code").as("country.code");
            select("country", "id").as("country.id");
            select("country", "name").as("country.name");
            join("subregions", "idSubregion").as("subregion");
            join("countries", "subregion", "idCountry").as("country");
         },
      );

      this.queries.setQueryDefinition(
         "countries",
         "countries",
         ({ select }) => {
            select("code");
            select("id");
            select("name");
         },
      );

      this.queries.setQueryDefinition(
         "persons",
         "persons",
         ({ select, join }) => {
            select("id");
            select("firstName");
            select("lastName");
            select("genderCis");
            select("genderIdentity");
            select("birthdate");
            select("cities", "id").as("birthplace.id");
            select("cities", "name").as("birthplace.name");
            select("cities", "population").as("birthplace.population");
            select("subregions", "abbrev").as("birthplace.subregion.abbrev");
            select("subregions", "id").as("birthplace.subregion.id");
            select("subregions", "name").as("birthplace.subregion.name");
            select("countries", "code").as("birthplace.country.code");
            select("countries", "id").as("birthplace.country.id");
            select("countries", "name").as("birthplace.country.name");
            select("alignment", "chaotic").as("alignment.chaotic");
            select("alignment", "evil").as("alignment.evil");
            select("alignment", "good").as("alignment.good");
            select("alignment", "lawful").as("alignment.lawful");
            select("alignment", "neutralMorality").as(
               "alignment.neutralMorality",
            );
            select("alignment", "neutralOrder").as("alignment.neutralOrder");
            select("myersBriggs", "extroversion").as(
               "myersBriggs.extroversion",
            );
            select("myersBriggs", "feeling").as("myersBriggs.feeling");
            select("myersBriggs", "introversion").as(
               "myersBriggs.introversion",
            );
            select("myersBriggs", "intuition").as("myersBriggs.intuition");
            select("myersBriggs", "judging").as("myersBriggs.judging");
            select("myersBriggs", "perceiving").as("myersBriggs.perceiving");
            select("myersBriggs", "sensing").as("myersBriggs.sensing");
            select("myersBriggs", "thinking").as("myersBriggs.thinking");
            select("currentPhysical", "height").as("currentPhysical.height");
            select("currentPhysical", "weight").as("currentPhysical.weight");
            select("potentialPhysical", "height").as(
               "potentialPhysical.height",
            );
            select("potentialPhysical", "weight").as(
               "potentialPhysical.weight",
            );

            select("currentSkillMental", "charisma").as(
               "currentSkillMental.charisma",
            );
            select("currentSkillMental", "constitution").as(
               "currentSkillMental.constitution",
            );
            select("currentSkillMental", "intelligence").as(
               "currentSkillMental.intelligence",
            );
            select("currentSkillMental", "loyalty").as(
               "currentSkillMental.loyalty",
            );
            select("currentSkillMental", "wisdom").as(
               "currentSkillMental.wisdom",
            );
            select("currentSkillMental", "workEthic").as(
               "currentSkillMental.workEthic",
            );

            select("potentialSkillMental", "charisma").as(
               "potentialSkillMental.charisma",
            );
            select("potentialSkillMental", "constitution").as(
               "potentialSkillMental.constitution",
            );
            select("potentialSkillMental", "intelligence").as(
               "potentialSkillMental.intelligence",
            );
            select("potentialSkillMental", "loyalty").as(
               "potentialSkillMental.loyalty",
            );
            select("potentialSkillMental", "wisdom").as(
               "potentialSkillMental.wisdom",
            );
            select("potentialSkillMental", "workEthic").as(
               "potentialSkillMental.workEthic",
            );

            select("currentSkillPhysical", "dexterity").as(
               "currentSkillPhysical.dexterity",
            );
            select("currentSkillPhysical", "strength").as(
               "currentSkillPhysical.strength",
            );
            select("potentialSkillPhysical", "dexterity").as(
               "potentialSkillPhysical.dexterity",
            );
            select("potentialSkillPhysical", "strength").as(
               "potentialSkillPhysical.strength",
            );

            join("cities", "idBirthplace");
            join("subregions", "cities", "idSubregion");
            join("countries", "subregions", "idCountry");
            join("personsAlignment", "id").as("alignment");
            join("personsHealth", "id").as("health");
            join("personsMyersBriggs", "id").as("myersBriggs");
            join("personsCurrentPhysical", "id").as("currentPhysical");
            join("personsCurrentSkillMental", "id").as("currentSkillMental");
            join("personsCurrentSkillPhysical", "id").as(
               "currentSkillPhysical",
            );
            join("personsPotentialPhysical", "id").as("potentialPhysical");
            join("personsPotentialSkillMental", "id").as(
               "potentialSkillMental",
            );
            join("personsPotentialSkillPhysical", "id").as(
               "potentialSkillPhysical",
            );
         },
      );

      this.queries.setQueryDefinition(
         "simulation",
         "simulation",
         ({ select }) => {
            select("date");
            select("id");
         },
      );

      this.queries.setQueryDefinition(
         "subregions",
         "subregions",
         ({ select, join }) => {
            select("abbrev");
            select("id");
            select("name");
            select("country", "code").as("country.code");
            select("country", "id").as("country.id");
            select("country", "name").as("country.name");
            join("countries", "idCountry").as("country");
         },
      );
   }

   private _seed() {
      const persons = Array.from({ length: 1_000 }, () =>
         this.fakeClientPerson.fakePerson(),
      );

      const league = {
         id: "my-league",
         name: "My League",
      };

      const { subleagues, teams } = this.fakeClientStructure.createLeague({
         league: {
            id: "my-league",
            name: "My League",
            subleagues: [
               {
                  divisions: [
                     {
                        id: "north-division",
                        name: "North Division",
                        compassPoint: "N",
                     },
                     {
                        id: "south-division",
                        name: "South Division",
                        compassPoint: "S",
                     },
                     {
                        id: "east-division",
                        name: "East Division",
                        compassPoint: "E",
                     },
                     {
                        id: "west-division",
                        name: "West Division",
                        compassPoint: "W",
                     },
                  ],
                  id: "my-subleague",
                  name: "My Subleague",
                  numTeams: 20,
               },
            ],
         },
      });

      const numGames = 100;

      const dateStart = new Date();
      const dateEnd = dayjs(dateStart).add(numGames, "days").toDate();

      const gameGroup = this.fakeClientStructure.createGameGroup({
         dateEnd: getDateString(dateEnd),
         dateStart: getDateString(dateStart),
         idLeague: league.id,
         name: "My Game Group",
         teams,
      });
      const games = this.fakeClientStructure.createGames({
         dateEnd: getDateString(dateEnd),
         dateStart: getDateString(dateStart),
         idGameGroup: gameGroup.id,
         numGames,
         teams,
      });
      const tournament = this.fakeClientStructure.createTournament({});

      this.store.transaction(() => {
         for (const person of persons) {
            const {
               alignment,
               myersBriggs,
               currentPhysical,
               currentSkillMental,
               currentSkillPhysical,
               potentialPhysical,
               potentialSkillMental,
               potentialSkillPhysical,
               health,
               ..._person
            } = person;
            this.store.setRow("persons", person.id, _person);

            this.store.setRow("personsAlignment", person.id, alignment);
            this.store.setRow("personsMyersBriggs", person.id, myersBriggs);
            this.store.setRow(
               "personsCurrentPhysical",
               person.id,
               currentPhysical,
            );
            this.store.setRow(
               "personsCurrentSkillMental",
               person.id,
               currentSkillMental,
            );
            this.store.setRow(
               "personsCurrentSkillPhysical",
               person.id,
               currentSkillPhysical,
            );
            this.store.setRow(
               "personsPotentialPhysical",
               person.id,
               potentialPhysical,
            );
            this.store.setRow(
               "personsPotentialSkillMental",
               person.id,
               potentialSkillMental,
            );
            this.store.setRow(
               "personsPotentialSkillPhysical",
               person.id,
               potentialSkillPhysical,
            );
            this.store.setRow("personsHealth", person.id, {
               id: person.id,
               health: JSON.stringify(health),
            });
         }

         for (const city of cities) {
            this.store.setRow("cities", city.id, city);
         }

         for (const subregion of subregions) {
            this.store.setRow("subregions", subregion.id, subregion);
         }

         for (const country of countries) {
            this.store.setRow("countries", country.id, country);
         }

         for (const subleague of subleagues) {
            if (subleague) {
               const { divisions } = subleague;

               this.store.setRow("subleagues", subleague.id, league);

               for (const division of divisions) {
                  const { teams } = division;
                  this.store.setRow("divisions", division.id, division);

                  for (const team of teams) {
                     this.store.setRow("teams", team.id, team);
                  }
               }
            }
         }

         this.store.setRow("simulation", "simulation", {
            date: getDateString(new Date()),
            id: "simulation",
         });
      });
   }

   private _makeArray(item: unknown) {
      if (isObject(item)) {
         return Object.values(item as typeof Object);
      }

      throw new Error("item is not an object");
   }

   private _convertDotNotationToNestedObject(_item: unknown) {
      if (isObject(_item)) {
         const item = _item as Record<string, unknown>;
         const nestedObject: Record<string, unknown> = {};
         for (const key in item) {
            const value = item[key];
            const nestedKeys = key.split(".");
            let currentObject = nestedObject;
            for (let i = 0; i < nestedKeys.length - 1; i++) {
               const nestedKey = nestedKeys[i];
               if (!currentObject[nestedKey]) {
                  currentObject[nestedKey] = {};
               }
               currentObject = currentObject[nestedKey] as Record<
                  string,
                  unknown
               >;
            }
            const lastKey = nestedKeys[nestedKeys.length - 1];
            currentObject[lastKey] = value;
         }
         return nestedObject;
      }

      throw new Error("item is not an object");
   }

   public cities = (_input: TInputCities) => {
      const { offset, limit } = valibotParse<TInputCities>({
         schema: VInputCities,
         data: _input,
      });

      const cityIds = this.queries.getResultSortedRowIds(
         "cities",
         undefined,
         undefined,
         offset,
         limit,
      );

      const _cities = cityIds.map((id) =>
         this._convertDotNotationToNestedObject(
            this.queries.getResultRow("cities", id),
         ),
      );

      const cities = valibotParse<TCities>({
         schema: VCities,
         data: _cities,
      });

      const numTotal = this.queries.getResultRowCount("cities");

      return {
         cities,
         numTotal,
      };
   };

   public city = (_input: TInputCity) => {
      const { id } = valibotParse<TInputCity>({
         schema: VInputCity,
         data: _input,
      });

      const _city = this._convertDotNotationToNestedObject(
         this.queries.getResultRow("cities", id),
      );

      const city = valibotParse<TCity>({
         schema: VCity,
         data: _city,
      });

      return {
         city,
      };
   };

   public country = (_input: TInputCountry) => {
      const { id } = valibotParse<TInputCountry>({
         schema: VInputCountry,
         data: _input,
      });

      const _country = this._convertDotNotationToNestedObject(
         this.queries.getResultRow("countries", id),
      );

      const country = valibotParse<TCountry>({
         schema: VCountry,
         data: _country,
      });

      return {
         country,
      };
   };

   public countries = (_input: TInputCountries) => {
      const { offset, limit } = valibotParse<TInputCountries>({
         schema: VInputCountries,
         data: _input,
      });

      const countryIds = this.queries.getResultSortedRowIds(
         "countries",
         undefined,
         undefined,
         offset,
         limit,
      );

      const _countries = countryIds.map((id) =>
         this._convertDotNotationToNestedObject(
            this.queries.getResultRow("countries", id),
         ),
      );

      const countries = valibotParse<TCountries>({
         schema: VCountries,
         data: _countries,
      });

      const numTotal = this.queries.getResultRowCount("countries");

      return {
         countries,
         numTotal,
      };
   };

   public person = (_input: TInputPerson) => {
      const { id } = valibotParse<TInputPerson>({
         schema: VInputPerson,
         data: _input,
      });

      const _person = this._convertDotNotationToNestedObject(
         this.queries.getResultRow("persons", id),
      );

      const person = valibotParse<TPerson>({
         schema: VPerson,
         data: _person,
      });

      return {
         person,
      };
   };

   public persons = (_input: TInputPersons) => {
      const { offset, limit } = valibotParse<TInputPersons>({
         schema: VInputPersons,
         data: _input,
      });

      const personIds = this.queries.getResultSortedRowIds(
         "persons",
         undefined,
         undefined,
         offset,
         limit,
      );

      const _persons = personIds.map((id) =>
         this._convertDotNotationToNestedObject(
            this.queries.getResultRow("persons", id),
         ),
      );

      const persons = valibotParse<TPersons>({
         schema: VPersons,
         data: _persons,
      });

      const numTotal = this.queries.getResultRowCount("persons");

      return {
         numTotal,
         persons,
      };
   };

   public subregion = (_input: TInputSubregion) => {
      const { id } = valibotParse<TInputSubregion>({
         schema: VInputSubregion,
         data: _input,
      });

      const _subregion = this._convertDotNotationToNestedObject(
         this.queries.getResultRow("subregions", id),
      );

      const subregion = valibotParse<TSubregion>({
         schema: VSubregion,
         data: _subregion,
      });

      return {
         subregion,
      };
   };

   public subregions = (_input: TInputSubregions) => {
      const { offset, limit } = valibotParse<TInputSubregions>({
         schema: VInputSubregions,
         data: _input,
      });

      const subregionIds = this.queries.getResultSortedRowIds(
         "subregions",
         undefined,
         undefined,
         offset,
         limit,
      );

      const _subregions = subregionIds.map((id) =>
         this._convertDotNotationToNestedObject(
            this.queries.getResultRow("subregions", id),
         ),
      );

      const subregions = valibotParse<TSubregions>({
         schema: VSubregions,
         data: _subregions,
      });

      const numTotal = this.queries.getResultRowCount("subregions");

      return {
         subregions,
         numTotal,
      };
   };

   public testQuery() {
      return this._makeArray(this.queries.getResultTable("countries"));
   }
}

export default DbClient;

const VInputConstructor = object({
   name: string(),
});
type TInputConstructor = Input<typeof VInputConstructor>;

const VInputCities = object({
   limit: number(),
   offset: number(),
});
type TInputCities = Input<typeof VInputCities>;
const VCitiesObj = merge([
   pick(VDbCity, ["id", "name", "population"]),
   object({
      country: VDbCountry,
      subregion: omit(VDbSubregion, ["idCountry"]),
   }),
]);
const VCities = array(VCitiesObj);
type TCities = Input<typeof VCities>;

const VInputCity = object({
   id: string(),
});
type TInputCity = Input<typeof VInputCity>;
const VCity = merge([
   pick(VDbCity, ["id", "name", "population"]),
   object({
      country: VDbCountry,
      subregion: omit(VDbSubregion, ["idCountry"]),
   }),
]);
type TCity = Input<typeof VCity>;

const VInputCountry = object({
   id: string(),
});
type TInputCountry = Input<typeof VInputCountry>;
const VCountry = VDbCountry;
type TCountry = Input<typeof VCountry>;

const VInputCountries = object({
   limit: number(),
   offset: number(),
});
type TInputCountries = Input<typeof VInputCountries>;
const VCountries = array(VDbCountry);
type TCountries = Input<typeof VCountries>;

const VInputPersons = object({
   limit: number(),
   offset: number(),
});
type TInputPersons = Input<typeof VInputPersons>;
const VPersonsObj = VDbPersonFull;
const VPersons = array(VPersonsObj);
type TPersons = Input<typeof VPersons>;

const VInputPerson = object({
   id: string(),
});
type TInputPerson = Input<typeof VInputPerson>;
const VPerson = merge([
   pick(VDbPerson, [
      "id",
      "birthdate",
      "firstName",
      "genderCis",
      "genderIdentity",
      "lastName",
   ]),
   object({
      alignment: omit(VDbPersonAlignment, ["id"]),
      birthplace: omit(VDbCity, ["idCountry", "idSubregion"]),
      currentSkillMental: omit(VDbPersonSkillMental, ["id"]),
      currentSkillPhysical: omit(VDbPersonSkillPhysical, ["id"]),
      currentPhysical: omit(VDbPersonPhysical, ["id"]),
      potentialSkillMental: omit(VDbPersonSkillMental, ["id"]),
      potentialSkillPhysical: omit(VDbPersonSkillPhysical, ["id"]),

      myersBriggs: omit(VDbPersonMyersBriggs, ["id"]),
   }),
]);
type TPerson = Input<typeof VPerson>;

const VInputSubregion = object({
   id: string(),
});
type TInputSubregion = Input<typeof VInputSubregion>;
const VSubregion = merge([
   pick(VDbSubregion, ["id", "abbrev", "name"]),
   object({
      country: VDbCountry,
   }),
]);
type TSubregion = Input<typeof VSubregion>;

const VInputSubregions = object({
   limit: number(),
   offset: number(),
});
type TInputSubregions = Input<typeof VInputSubregions>;
const VSubregionsObj = merge([
   pick(VDbSubregion, ["id", "abbrev", "name"]),
   object({
      country: VDbCountry,
   }),
]);
const VSubregions = array(VSubregionsObj);
type TSubregions = Input<typeof VSubregions>;
