import type { Store } from "tinybase";
import {
   type IndexedDbPersister,
   createIndexedDbPersister,
} from "tinybase/persisters/persister-indexed-db";
import { createQueries, createStore } from "tinybase/with-schemas";
import { string } from "valibot";
import {
   cities,
   countries,
   divisions,
   games,
   leagues,
   parks,
   players,
   subLeagues,
   subregions,
   teams,
} from "../data";
import { FakeClientPerson, FakeClientStructure } from "../fake";
import { isObject } from "../functions";
import {
   type TCities,
   type TCity,
   type TCountries,
   type TCountry,
   type TInputCities,
   type TInputCity,
   type TInputConstructor,
   type TInputCountries,
   type TInputCountry,
   type TInputPerson,
   type TInputPersons,
   type TInputSubregion,
   type TInputSubregions,
   type TInputTeams,
   type TPerson,
   type TPersons,
   type TSubregion,
   type TSubregions,
   type TTeams,
   VCities,
   VCity,
   VCountries,
   VCountry,
   VInputCities,
   VInputCity,
   VInputConstructor,
   VInputCountries,
   VInputCountry,
   VInputPerson,
   VInputPersons,
   VInputSubregion,
   VInputSubregions,
   VPerson,
   VPersons,
   VSubregion,
   VSubregions,
   VTeams,
} from "../types/tDbClient";
import { valibotParse } from "../valibot";

class DbClient {
   private fakeClientPerson = new FakeClientPerson({
      genderSetting: "traditional",
   });
   // private fakeClientStructure = new FakeClientStructure({
   //    geographicLimits: {
   //       idSubregions: ["illinois-united-states"],
   //    },
   // });

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
         idSubLeague: { type: "string" },
         name: { type: "string" },
         slug: { type: "string" },
      },
      games: {
         date: { type: "string" },
         id: { type: "string" },
         idGameGroup: { type: "string" },
         idLeague: { type: "string" },
         idTeamAway: { type: "string" },
         idTeamHome: { type: "string" },
         time: { type: "number" },
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
         abbrev: { type: "string" },
         id: { type: "string" },
         name: { type: "string" },
         slug: { type: "string" },
      },
      parks: {
         avg: { type: "number" },
         avgL: { type: "number" },
         avgR: { type: "number" },
         basesX0: { type: "number" },
         basesX1: { type: "number" },
         basesX2: { type: "number" },
         basesY0: { type: "number" },
         basesY1: { type: "number" },
         basesY2: { type: "number" },
         batterLeftX: { type: "number" },
         batterLeftY: { type: "number" },
         batterRightX: { type: "number" },
         batterRightY: { type: "number" },
         capacity: { type: "number" },
         d: { type: "number" },
         dimensionsX: { type: "number" },
         dimensionsY: { type: "number" },
         distances0: { type: "number" },
         distances1: { type: "number" },
         distances2: { type: "number" },
         distances3: { type: "number" },
         distances4: { type: "number" },
         distances5: { type: "number" },
         distances6: { type: "number" },
         foulGround: { type: "number" },
         hr: { type: "number" },
         hrL: { type: "number" },
         hrR: { type: "number" },
         id: { type: "string" },
         isHomeTeamDugoutAtFirstBase: { type: "boolean" },
         name: { type: "string" },
         idOotp: { type: "string" },
         positionsX0: { type: "number" },
         positionsX1: { type: "number" },
         positionsX2: { type: "number" },
         positionsX3: { type: "number" },
         positionsX4: { type: "number" },
         positionsX5: { type: "number" },
         positionsX6: { type: "number" },
         positionsX7: { type: "number" },
         positionsX8: { type: "number" },
         positionsX9: { type: "number" },
         positionsY0: { type: "number" },
         positionsY1: { type: "number" },
         positionsY2: { type: "number" },
         positionsY3: { type: "number" },
         positionsY4: { type: "number" },
         positionsY5: { type: "number" },
         positionsY6: { type: "number" },
         positionsY7: { type: "number" },
         positionsY8: { type: "number" },
         positionsY9: { type: "number" },
         rain0: { type: "number" },
         rain1: { type: "number" },
         rain2: { type: "number" },
         rain3: { type: "number" },
         rain4: { type: "number" },
         rain5: { type: "number" },
         rain6: { type: "number" },
         rain7: { type: "number" },
         rain8: { type: "number" },
         rain9: { type: "number" },
         rain10: { type: "number" },
         rain11: { type: "number" },
         slug: { type: "string" },
         t: { type: "number" },
         temperature0: { type: "number" },
         temperature1: { type: "number" },
         temperature2: { type: "number" },
         temperature3: { type: "number" },
         temperature4: { type: "number" },
         temperature5: { type: "number" },
         temperature6: { type: "number" },
         temperature7: { type: "number" },
         temperature8: { type: "number" },
         temperature9: { type: "number" },
         temperature10: { type: "number" },
         temperature11: { type: "number" },
         turf: { type: "number" },
         type: { type: "number" },
         wallHeights0: { type: "number" },
         wallHeights1: { type: "number" },
         wallHeights2: { type: "number" },
         wallHeights3: { type: "number" },
         wallHeights4: { type: "number" },
         wallHeights5: { type: "number" },
         wallHeights6: { type: "number" },
         wind: { type: "number" },
         windDirection: { type: "number" },
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
      personsBaseball: {
         idBbRef: { type: "string" },
         idTeam: { type: "string" },
         id: { type: "string" },
         position: { type: "string" },
      },
      personsBaseballRatingsBatting: {
         avoidKs: { type: "number" },
         contact: { type: "number" },
         eye: { type: "number" },
         gap: { type: "number" },
         id: { type: "string" },
         power: { type: "number" },
      },
      personsBaseballPotentialBatting: {
         avoidKs: { type: "number" },
         contact: { type: "number" },
         eye: { type: "number" },
         gap: { type: "number" },
         id: { type: "string" },
         power: { type: "number" },
      },
      personsBaseballRatingsBattingSplitsL: {
         avoidKs: { type: "number" },
         contact: { type: "number" },
         eye: { type: "number" },
         gap: { type: "number" },
         id: { type: "string" },
         power: { type: "number" },
      },
      personsBaseballRatingsBattingSplitsR: {
         avoidKs: { type: "number" },
         contact: { type: "number" },
         eye: { type: "number" },
         gap: { type: "number" },
         id: { type: "string" },
         power: { type: "number" },
      },
      personsBaseballRatingsFieldingCatcher: {
         ability: { type: "number" },
         arm: { type: "number" },
         id: { type: "string" },
      },
      personsBaseballRatingsFieldingInfield: {
         arm: { type: "number" },
         doublePlay: { type: "number" },
         error: { type: "number" },
         id: { type: "string" },
         range: { type: "number" },
      },
      personsBaseballRatingsFieldingOutfield: {
         arm: { type: "number" },
         error: { type: "number" },
         id: { type: "string" },
         range: { type: "number" },
      },
      personsBaseballRatingsFieldingPositionP: {
         experience: { type: "number" },
         rating: { type: "number" },
      },
      personsBaseballRatingsFieldingPositionC: {
         experience: { type: "number" },
         rating: { type: "number" },
      },
      personsBaseballRatingsFieldingPosition1b: {
         experience: { type: "number" },
         rating: { type: "number" },
      },
      personsBaseballRatingsFieldingPosition2b: {
         experience: { type: "number" },
         rating: { type: "number" },
      },
      personsBaseballRatingsFieldingPosition3b: {
         experience: { type: "number" },
         rating: { type: "number" },
      },
      personsBaseballRatingsFieldingPositionSs: {
         experience: { type: "number" },
         rating: { type: "number" },
      },
      personsBaseballRatingsFieldingPositionLf: {
         experience: { type: "number" },
         rating: { type: "number" },
      },
      personsBaseballRatingsFieldingPositionCf: {
         experience: { type: "number" },
         rating: { type: "number" },
      },
      personsBaseballRatingsFieldingPositionRf: {
         experience: { type: "number" },
         rating: { type: "number" },
      },
      personsBaseballRatingsPitching: {
         balk: { type: "number" },
         control: { type: "number" },
         hold: { type: "number" },
         id: { type: "string" },
         movement: { type: "number" },
         stamina: { type: "number" },
         stuff: { type: "number" },
         velocity: { type: "number" },
         wildPitch: { type: "number" },
      },
      personsBaseballRatingsPitchingSplitsL: {
         balk: { type: "number" },
         control: { type: "number" },
         id: { type: "string" },
         movement: { type: "number" },
         stuff: { type: "number" },
         wildPitch: { type: "number" },
      },
      personsBaseballRatingsPitchingSplitsR: {
         balk: { type: "number" },
         control: { type: "number" },
         id: { type: "string" },
         movement: { type: "number" },
         stuff: { type: "number" },
         wildPitch: { type: "number" },
      },
      personsBaseballRatingsPitches: {
         changeup: { type: "number" },
         circlechange: { type: "number" },
         cutter: { type: "number" },
         curveball: { type: "number" },
         fastball: { type: "number" },
         forkball: { type: "number" },
         knuckleball: { type: "number" },
         knucklecurve: { type: "number" },
         id: { type: "string" },
      },
      personsBaseballPotentialPitching: {
         balk: { type: "number" },
         control: { type: "number" },
         id: { type: "string" },
         movement: { type: "number" },
         stuff: { type: "number" },
         wildPitch: { type: "number" },
      },
      personsBaseballPotentialPitchingPitches: {
         changeup: { type: "number" },
         circlechange: { type: "number" },
         cutter: { type: "number" },
         curveball: { type: "number" },
         fastball: { type: "number" },
         forkball: { type: "number" },
         knuckleball: { type: "number" },
         knucklecurve: { type: "number" },
         id: { type: "string" },
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
      personsNicknames: {
         idPerson: { type: "string" },
         nickname: { type: "string" },
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
      subLeagues: {
         id: { type: "string" },
         idLeague: { type: "string" },
         abbrev: { type: "string" },
         name: { type: "string" },
         slug: { type: "string" },
      },
      subregions: {
         id: { type: "string" },
         idCountry: { type: "string" },
         abbrev: { type: "string" },
         name: { type: "string" },
      },
      teams: {
         abbrev: { type: "string" },
         backgroundColor: { type: "string" },
         idDivision: { type: "string" },
         hatMainColor: { type: "string" },
         hatVisorColor: { type: "string" },
         idHistorical: { type: "string" },
         id: { type: "string" },
         idLeague: { type: "string" },
         idPark: { type: "string" },
         idSubLeague: { type: "string" },
         jerseyAwayColor: { type: "string" },
         jerseyMainColor: { type: "string" },
         jerseyPinStripeColor: { type: "string" },
         jerseySecondaryColor: { type: "string" },
         name: { type: "string" },
         nickname: { type: "string" },
         slug: { type: "string" },
         textColor: { type: "string" },
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

      this.queries.setQueryDefinition("leagues", "leagues", ({ select }) => {
         select("abbrev");
         select("id");
         select("name");
         select("slug");
      });

      this.queries.setQueryDefinition("teams", "teams", ({ select, join }) => {
         select("id");
         select("idDivision");
         select("idLeague");
         select("idPark");
         select("idSubLeague");
         select("abbrev");
         select("backgroundColor");
         select("hatMainColor");
         select("hatVisorColor");
         select("idHistorical");
         select("jerseyAwayColor");
         select("jerseyMainColor");
         select("jerseyPinStripeColor");
         select("jerseySecondaryColor");
         select("name");
         select("nickname");
         select("slug");
         select("textColor");
         select("division", "id").as("division.id");
         select("division", "name").as("division.name");
         select("division", "slug").as("division.slug");
         select("league", "id").as("league.id");
         select("league", "name").as("league.name");
         select("league", "slug").as("league.slug");
         select("park", "id").as("park.id");
         select("park", "name").as("park.name");
         select("subLeague", "id").as("subLeague.id");
         select("subLeague", "name").as("subLeague.name");
         select("subLeague", "slug").as("subLeague.slug");
         join("divisions", "idDivision").as("division");
         join("leagues", "idLeague").as("league");
         join("parks", "idPark").as("park");
         join("subLeagues", "idSubLeague").as("subLeague");
      });
   }

   private _seed() {
      const persons = Array.from({ length: players.length }, () =>
         this.fakeClientPerson.fakePerson(),
      );

      this.store.transaction(() => {
         for (const [i, _person] of persons.entries()) {
            const player = players[i];
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
            } = _person;

            const person = {
               id: player.id,
               idBirthplace: _person.idBirthplace,
               firstName: player.firstName,
               genderCis: "m",
               genderIdentity: "m",
               lastName: player.lastName,
            };

            this.store.setRow("personsBaseball", person.id, {
               idBbRef: player.idBbRef,
               id: person.id,
               idTeam: player.idTeam,
               position: player.position,
            });

            this.store.setRow("personsBaseballRatingsBatting", person.id, {
               avoidKs: player.ratings.batting.avoidKs,
               contact: player.ratings.batting.contact,
               eye: player.ratings.batting.eye,
               gap: player.ratings.batting.gap,
               id: person.id,
               power: player.ratings.batting.power,
            });

            this.store.setRow("personsBaseballPotentialBatting", person.id, {
               avoidKs: player.potential.batting.avoidKs,
               contact: player.potential.batting.contact,
               eye: player.potential.batting.eye,
               gap: player.potential.batting.gap,
               id: person.id,
               power: player.potential.batting.power,
            });

            this.store.setRow(
               "personsBaseballRatingsBattingSplitsL",
               person.id,
               {
                  avoidKs: player.ratings.batting.splits.l.avoidKs,
                  contact: player.ratings.batting.splits.l.contact,
                  eye: player.ratings.batting.splits.l.eye,
                  gap: player.ratings.batting.splits.l.gap,
                  id: person.id,
                  power: player.ratings.batting.splits.l.power,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsBattingSplitsR",
               person.id,
               {
                  avoidKs: player.ratings.batting.splits.r.avoidKs,
                  contact: player.ratings.batting.splits.r.contact,
                  eye: player.ratings.batting.splits.r.eye,
                  gap: player.ratings.batting.splits.r.gap,
                  id: person.id,
                  power: player.ratings.batting.splits.r.power,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsFieldingCatcher",
               person.id,
               {
                  ability: player.ratings.fielding.catcher.ability,
                  arm: player.ratings.fielding.catcher.arm,
                  id: person.id,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsFieldingInfield",
               person.id,
               {
                  arm: player.ratings.fielding.infield.arm,
                  doublePlay: player.ratings.fielding.infield.doublePlay,
                  error: player.ratings.fielding.infield.error,
                  id: person.id,
                  range: player.ratings.fielding.infield.range,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsFieldingOutfield",
               person.id,
               {
                  arm: player.ratings.fielding.outfield.arm,
                  error: player.ratings.fielding.outfield.error,
                  id: person.id,
                  range: player.ratings.fielding.outfield.range,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsFieldingPositionP",
               person.id,
               {
                  experience: player.ratings.fielding.position.p.experience,
                  rating: player.ratings.fielding.position.p.rating,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsFieldingPositionC",
               person.id,
               {
                  experience: player.ratings.fielding.position.c.experience,
                  rating: player.ratings.fielding.position.c.rating,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsFieldingPosition1b",
               person.id,
               {
                  experience: player.ratings.fielding.position["1b"].experience,
                  rating: player.ratings.fielding.position["1b"].rating,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsFieldingPosition2b",
               person.id,
               {
                  experience: player.ratings.fielding.position["2b"].experience,
                  rating: player.ratings.fielding.position["2b"].rating,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsFieldingPosition3b",
               person.id,
               {
                  experience: player.ratings.fielding.position["3b"].experience,
                  rating: player.ratings.fielding.position["3b"].rating,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsFieldingPositionSs",
               person.id,
               {
                  experience: player.ratings.fielding.position.ss.experience,
                  rating: player.ratings.fielding.position.ss.rating,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsFieldingPositionLf",
               person.id,
               {
                  experience: player.ratings.fielding.position.lf.experience,
                  rating: player.ratings.fielding.position.lf.rating,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsFieldingPositionCf",
               person.id,
               {
                  experience: player.ratings.fielding.position.cf.experience,
                  rating: player.ratings.fielding.position.cf.rating,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsFieldingPositionRf",
               person.id,
               {
                  experience: player.ratings.fielding.position.rf.experience,
                  rating: player.ratings.fielding.position.rf.rating,
               },
            );

            this.store.setRow("personsBaseballRatingsPitching", person.id, {
               balk: player.ratings.pitching.balk,
               control: player.ratings.pitching.control,
               hold: player.ratings.pitching.hold,
               id: person.id,
               movement: player.ratings.pitching.movement,
               stamina: player.ratings.pitching.stamina,
               stuff: player.ratings.pitching.stuff,
               velocity: player.ratings.pitching.velocity,
               wildPitch: player.ratings.pitching.wildPitch,
            });

            this.store.setRow(
               "personsBaseballRatingsPitchingSplitsL",
               person.id,
               {
                  balk: player.ratings.pitching.splits.l.balk,
                  control: player.ratings.pitching.splits.l.control,
                  id: person.id,
                  movement: player.ratings.pitching.splits.l.movement,
                  stuff: player.ratings.pitching.splits.l.stuff,
                  wildPitch: player.ratings.pitching.splits.l.wildPitch,
               },
            );

            this.store.setRow(
               "personsBaseballRatingsPitchingSplitsR",
               person.id,
               {
                  balk: player.ratings.pitching.splits.r.balk,
                  control: player.ratings.pitching.splits.r.control,
                  id: person.id,
                  movement: player.ratings.pitching.splits.r.movement,
                  stuff: player.ratings.pitching.splits.r.stuff,
                  wildPitch: player.ratings.pitching.splits.r.wildPitch,
               },
            );

            this.store.setRow("personsBaseballRatingsPitches", person.id, {
               changeup: player.ratings.pitching.pitches.changeup,
               circlechange: player.ratings.pitching.pitches.circlechange,
               cutter: player.ratings.pitching.pitches.cutter,
               curveball: player.ratings.pitching.pitches.curveball,
               fastball: player.ratings.pitching.pitches.fastball,
               forkball: player.ratings.pitching.pitches.forkball,
               knuckleball: player.ratings.pitching.pitches.knuckleball,
               knucklecurve: player.ratings.pitching.pitches.knucklecurve,
               id: person.id,
            });

            this.store.setRow("personsBaseballPotentialPitching", person.id, {
               balk: player.potential.pitching.balk,
               control: player.potential.pitching.control,
               id: person.id,
               movement: player.potential.pitching.movement,
               stuff: player.potential.pitching.stuff,
               wildPitch: player.potential.pitching.wildPitch,
            });

            this.store.setRow(
               "personsBaseballPotentialPitchingPitches",
               person.id,
               {
                  changeup: player.potential.pitching.pitches.changeup,
                  circlechange: player.potential.pitching.pitches.circlechange,
                  cutter: player.potential.pitching.pitches.cutter,
                  curveball: player.potential.pitching.pitches.curveball,
                  fastball: player.potential.pitching.pitches.fastball,
                  forkball: player.potential.pitching.pitches.forkball,
                  knuckleball: player.potential.pitching.pitches.knuckleball,
                  knucklecurve: player.potential.pitching.pitches.knucklecurve,
                  id: person.id,
               },
            );

            if (player.nickname) {
               this.store.setRow("personsNicknames", person.id, {
                  idPerson: person.id,
                  nickname: player.nickname,
               });
            }

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

         const gameGroup = {
            dateEnd: "2011-09-28",
            dateStart: "2011-03-31",
            id: "major-league-baseball-regular-season-2011",
            idLeague: "major-league-baseball",
            name: "Major League Baseball Regular Season 2011",
            standings: JSON.stringify(
               teams.reduce(
                  (acc, team) => {
                     acc[team.id] = {
                        id: team.id,
                        losses: 0,
                        wins: 0,
                     };
                     return acc;
                  },
                  {} as Record<
                     string,
                     { id: string; losses: number; wins: number }
                  >,
               ),
            ),
         };

         this.store.setRow("gameGroups", gameGroup.id, gameGroup);

         for (const game of games) {
            // @ts-ignore TODO: fix this
            game.idGameGroup = gameGroup.id;
            this.store.setRow("games", game.id, game);
         }

         for (const park of parks) {
            this.store.setRow("parks", park.id, park);
         }

         for (const league of leagues) {
            this.store.setRow("leagues", league.id, league);
         }

         for (const subleague of subLeagues) {
            this.store.setRow("subLeagues", subleague.id, subleague);
         }

         for (const division of divisions) {
            this.store.setRow("divisions", division.id, division);
         }

         for (const team of teams) {
            this.store.setRow("teams", team.id, team);
         }

         this.store.setRow("simulation", "simulation", {
            date: "2011-03-31",
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

   public teams = (_input: TInputTeams) => {
      const { offset, limit } = valibotParse<TInputSubregions>({
         schema: VInputSubregions,
         data: _input,
      });

      const teamIds = this.queries.getResultSortedRowIds(
         "teams",
         undefined,
         undefined,
         offset,
         limit,
      );

      const _teams = teamIds.map((id) =>
         this._convertDotNotationToNestedObject(
            this.queries.getResultRow("teams", id),
         ),
      );

      console.log("_teams", _teams);

      const teams = valibotParse<TTeams>({
         schema: VTeams,
         data: _teams,
      });

      const numTotal = this.queries.getResultRowCount("teams");

      return {
         teams,
         numTotal,
      };
   };

   public testQuery() {
      return this._makeArray(this.queries.getResultTable("countries"));
   }
}

export default DbClient;
