import {
   type Input,
   boolean,
   merge,
   number,
   object,
   omit,
   pick,
   string,
} from "valibot";
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

export const VDbSimulation = object({
   date: string([VRegexDate]),
   id: string(),
   name: string(),
});

export const VDbCountry = object({
   id: string(),
   code: string(),
   name: string(),
});

export const VDbPersonBaseball = object({
   idBbRef: string(),
   idTeam: string(),
   id: string(),
   position: string(),
});
export const VDbPersonBaseballRatingsBatting = object({
   avoidKs: number(),
   contact: number(),
   eye: number(),
   gap: number(),
   id: string(),
   power: number(),
});
export const VDbPersonBaseballPotentialBatting = object({
   avoidKs: number(),
   contact: number(),
   eye: number(),
   gap: number(),
   id: string(),
   power: number(),
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

export const VDbLeague = object({
   abbrev: string(),
   id: string(),
   name: string(),
   slug: string(),
});
export const VDbPark = object({
   avg: number(),
   avgL: number(),
   avgR: number(),
   basesX0: number(),
   basesX1: number(),
   basesX2: number(),
   basesY0: number(),
   basesY1: number(),
   basesY2: number(),
   batterLeftX: number(),
   batterLeftY: number(),
   batterRightX: number(),
   batterRightY: number(),
   capacity: number(),
   d: number(),
   dimensionsX: number(),
   dimensionsY: number(),
   distances0: number(),
   distances1: number(),
   distances2: number(),
   distances3: number(),
   distances4: number(),
   distances5: number(),
   distances6: number(),
   foulGround: number(),
   hr: number(),
   hrL: number(),
   hrR: number(),
   id: string(),
   isHomeTeamDugoutAtFirstBase: boolean(),
   name: string(),
   idOotp: string(),
   positionsX0: number(),
   positionsX1: number(),
   positionsX2: number(),
   positionsX3: number(),
   positionsX4: number(),
   positionsX5: number(),
   positionsX6: number(),
   positionsX7: number(),
   positionsX8: number(),
   positionsX9: number(),
   positionsY0: number(),
   positionsY1: number(),
   positionsY2: number(),
   positionsY3: number(),
   positionsY4: number(),
   positionsY5: number(),
   positionsY6: number(),
   positionsY7: number(),
   positionsY8: number(),
   positionsY9: number(),
   rain0: number(),
   rain1: number(),
   rain2: number(),
   rain3: number(),
   rain4: number(),
   rain5: number(),
   rain6: number(),
   rain7: number(),
   rain8: number(),
   rain9: number(),
   rain10: number(),
   rain11: number(),
   slug: string(),
   t: number(),
   temperature0: number(),
   temperature1: number(),
   temperature2: number(),
   temperature3: number(),
   temperature4: number(),
   temperature5: number(),
   temperature6: number(),
   temperature7: number(),
   temperature8: number(),
   temperature9: number(),
   temperature10: number(),
   temperature11: number(),
   turf: number(),
   type: number(),
   wallHeights0: number(),
   wallHeights1: number(),
   wallHeights2: number(),
   wallHeights3: number(),
   wallHeights4: number(),
   wallHeights5: number(),
   wallHeights6: number(),
   wind: number(),
   windDirection: number(),
});

export const VDbSubLeague = object({
   id: string(),
   idLeague: string(),
   abbrev: string(),
   name: string(),
   slug: string(),
});

export const VDbTeam = object({
   id: string(),
   idHistorical: string(),
   idLeague: string(),
   idPark: string(),
   idSubLeague: string(),
   abbrev: string(),
   backgroundColor: string(),
   idDivision: string(),
   hatMainColor: string(),
   hatVisorColor: string(),
   jerseyAwayColor: string(),
   jerseyMainColor: string(),
   jerseyPinStripeColor: string(),
   jerseySecondaryColor: string(),
   name: string(),
   nickname: string(),
   slug: string(),
   textColor: string(),
});

export const VDbDivision = object({
   id: string(),
   idLeague: string(),
   idSubLeague: string(),
   name: string(),
   slug: string(),
});
