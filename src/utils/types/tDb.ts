import { type Input, merge, number, object, omit, pick, string } from "valibot";
import { VPickListGenderCis, VPickListGenderIdentity } from "./tPickList";
import { VRegexDate } from "./tRegex";

export const VDbCity = object({
   id: string(),
   idCountry: string(),
   idSubregion: string(),
   name: string(),
   population: number(),
});

export const VDbSubregion = object({
   id: string(),
   idCountry: string(),
   abbrev: string(),
   name: string(),
});

export const VDbCountry = object({
   id: string(),
   code: string(),
   name: string(),
});

export const VDbPersonAlignment = object({
   id: string(),
   chaotic: number(),
   evil: number(),
   good: number(),
   lawful: number(),
   neutralMorality: number(),
   neutralOrder: number(),
});

export const VDbPersonMyersBriggs = object({
   id: string(),
   extroversion: number(),
   feeling: number(),
   introversion: number(),
   intuition: number(),
   judging: number(),
   perceiving: number(),
   sensing: number(),
   thinking: number(),
});

export const VDbPersonPhysical = object({
   id: string(),
   height: number(),
   weight: number(),
});

export const VDPersonCurrentPhysical = VDbPersonPhysical;
export const VDbPersonPotentialPhysical = VDbPersonPhysical;

export const VDbPersonSkillMental = object({
   id: string(),
   charisma: number(),
   constitution: number(),
   intelligence: number(),
   loyalty: number(),
   wisdom: number(),
   workEthic: number(),
});

export const VDbPersonCurrentSkillMental = VDbPersonSkillMental;
export const VDbPersonPotentialSkillMental = VDbPersonSkillMental;

export const VDbPersonSkillPhysical = object({
   id: string(),
   dexterity: number(),
   strength: number(),
});

export const VDbPersonCurrentSkillPhysical = VDbPersonSkillPhysical;
export const VDbPersonPotentialSkillPhysical = VDbPersonSkillPhysical;

export const VDbPerson = object({
   id: string(),
   idBirthplace: string(),
   birthdate: string([VRegexDate]),
   firstName: string(),
   genderCis: VPickListGenderCis,
   genderIdentity: VPickListGenderIdentity,
   lastName: string(),
});

export const VDbPersonFull = merge([
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
      currentPhysical: omit(VDPersonCurrentPhysical, ["id"]),
      currentSkillMental: omit(VDbPersonCurrentSkillMental, ["id"]),
      currentSkillPhysical: omit(VDbPersonCurrentSkillPhysical, ["id"]),
      myersBriggs: omit(VDbPersonMyersBriggs, ["id"]),
      potentialPhysical: omit(VDbPersonPotentialPhysical, ["id"]),
      potentialSkillMental: omit(VDbPersonPotentialSkillMental, ["id"]),
      potentialSkillPhysical: omit(VDbPersonPotentialSkillPhysical, ["id"]),
   }),
]);
export type TDbPersonFull = Input<typeof VDbPersonFull>;
