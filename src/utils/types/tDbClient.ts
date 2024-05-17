import { name } from "happy-dom/lib/PropertySymbol.js";
import {
   type Input,
   array,
   coerce,
   merge,
   number,
   object,
   omit,
   pick,
   record,
   string,
   transform,
} from "valibot";
import {
   VDbCity,
   VDbCountry,
   VDbDivision,
   VDbLeague,
   VDbPark,
   VDbPerson,
   VDbPersonAlignment,
   VDbPersonFull,
   VDbPersonMyersBriggs,
   VDbPersonPhysical,
   VDbPersonSkillMental,
   VDbPersonSkillPhysical,
   VDbSubLeague,
   VDbSubregion,
   VDbTeam,
} from "./tDb";
import { VRegexDate } from "./tRegex";

export const VInputConstructor = object({
   name: string(),
});
export type TInputConstructor = Input<typeof VInputConstructor>;

export const VInputCities = object({
   limit: number(),
   offset: number(),
});
export type TInputCities = Input<typeof VInputCities>;
export const VCitiesObj = merge([
   pick(VDbCity, ["id", "name", "population"]),
   object({
      country: VDbCountry,
      subregion: omit(VDbSubregion, ["idCountry"]),
   }),
]);
export const VCities = array(VCitiesObj);
export type TCities = Input<typeof VCities>;

export const VInputCity = object({
   id: string(),
});
export type TInputCity = Input<typeof VInputCity>;
export const VCity = merge([
   pick(VDbCity, ["id", "name", "population"]),
   object({
      country: VDbCountry,
      subregion: omit(VDbSubregion, ["idCountry"]),
   }),
]);
export type TCity = Input<typeof VCity>;

export const VInputCountry = object({
   id: string(),
});
export type TInputCountry = Input<typeof VInputCountry>;
export const VCountry = VDbCountry;
export type TCountry = Input<typeof VCountry>;

export const VInputCountries = object({
   limit: number(),
   offset: number(),
});
export type TInputCountries = Input<typeof VInputCountries>;
export const VCountries = array(VDbCountry);
export type TCountries = Input<typeof VCountries>;

export const VInputPersons = object({
   limit: number(),
   offset: number(),
});
export type TInputPersons = Input<typeof VInputPersons>;
export const VPersonsObj = VDbPersonFull;
export const VPersons = array(VPersonsObj);
export type TPersons = Input<typeof VPersons>;

export const VInputPerson = object({
   id: string(),
});
export type TInputPerson = Input<typeof VInputPerson>;
export const VPerson = merge([
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
export type TPerson = Input<typeof VPerson>;

export const VInputSubregion = object({
   id: string(),
});
export type TInputSubregion = Input<typeof VInputSubregion>;
export const VSubregion = merge([
   pick(VDbSubregion, ["id", "abbrev", "name"]),
   object({
      country: VDbCountry,
   }),
]);
export type TSubregion = Input<typeof VSubregion>;

export const VInputSubregions = object({
   limit: number(),
   offset: number(),
});
export type TInputSubregions = Input<typeof VInputSubregions>;
export const VSubregionsObj = merge([
   pick(VDbSubregion, ["id", "abbrev", "name"]),
   object({
      country: VDbCountry,
   }),
]);
export const VSubregions = array(VSubregionsObj);
export type TSubregions = Input<typeof VSubregions>;

export const VInputTeams = object({
   limit: number(),
   offset: number(),
});
export type TInputTeams = Input<typeof VInputTeams>;

export const VTeamsObj = merge([
   VDbTeam,
   object({
      division: pick(VDbDivision, ["id", "name", "slug"]),
      league: pick(VDbLeague, ["id", "name", "slug"]),
      park: pick(VDbPark, ["id", "name"]),
      subLeague: pick(VDbSubLeague, ["id", "name", "slug"]),
   }),
]);
export const VTeams = array(VTeamsObj);
export type TTeams = Input<typeof VTeams>;

export const VInputLeagues = object({
   limit: number(),
   offset: number(),
});
export type TInputLeagues = Input<typeof VInputLeagues>;

export const VLeaguesObj = VDbLeague;
export const VLeagues = array(VLeaguesObj);
export type TLeagues = Input<typeof VLeagues>;

export const VInputDivisions = object({
   limit: number(),
   offset: number(),
});
export type TInputDivisions = Input<typeof VInputDivisions>;
export const VDivisionsObj = VDbDivision;
export const VDivisions = array(VDivisionsObj);
export type TDivisions = Input<typeof VDivisions>;

export const VInputParks = object({
   limit: number(),
   offset: number(),
});
export type TInputParks = Input<typeof VInputParks>;

export const VParksObj = VDbPark;

export const VParks = array(VParksObj);
export type TParks = Input<typeof VParks>;

export const VInputSubLeagues = object({
   limit: number(),
   offset: number(),
});
export type TInputSubLeagues = Input<typeof VInputSubLeagues>;
export const VSubLeaguesObj = VDbSubLeague;

export const VSubLeagues = array(VSubLeaguesObj);
export type TSubLeagues = Input<typeof VSubLeagues>;

export const VInputLeagueGameGroupStandings = object({
   idGameGroup: string(),
   idLeague: string(),
});
export type TInputLeagueGameGroupStandings = Input<
   typeof VInputLeagueGameGroupStandings
>;

export const VGameGroup = object({
   id: string(),
   idLeague: string(),
   dateEnd: string([VRegexDate]),
   dateStart: string([VRegexDate]),
   name: string(),
   standings: coerce(
      record(
         string(),
         object({
            id: string(),
            losses: number(),
            wins: number(),
         }),
      ),
      (input) => JSON.parse(input as string),
   ),
});
export type TGameGroup = Input<typeof VGameGroup>;
