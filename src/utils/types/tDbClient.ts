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
