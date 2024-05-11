import {
   type Input,
   boolean,
   maxValue,
   nullable,
   number,
   object,
   string,
} from "valibot";
import { VPickListGamePositions } from "./tPickList";
import { VRegexDate, VRegexHexColor, VRegexSlug } from "./tRegex";

const VRowOotpPlayerRatingsPitches = object({
   changeup: number(),
   circlechange: number(),
   cutter: number(),
   curveball: number(),
   fastball: number(),
   forkball: number(),
   knuckleball: number(),
   knucklecurve: number(),
   screwball: number(),
   sinker: number(),
   slider: number(),
   splitter: number(),
});

const VRowOotpPlayerRatingsBattingSplitsValues = object({
   avoidKs: number(),
   contact: number(),
   gap: number(),
   eye: number(),
   power: number(),
});

const VRowOotpPlayerRatingsBattingSplits = object({
   l: VRowOotpPlayerRatingsBattingSplitsValues,
   r: VRowOotpPlayerRatingsBattingSplitsValues,
});

const VRowOotpPlayerRatingsBatting = object({
   avoidKs: number(),
   contact: number(),
   eye: number(),
   gap: number(),
   power: number(),
   splits: VRowOotpPlayerRatingsBattingSplits,
});

const VRowOotpPlayerPotentialBatting = object({
   avoidKs: number(),
   contact: number(),
   gap: number(),
   eye: number(),
   power: number(),
});

const VRowOotpPlayerRatingsPitchingSplitsValues = object({
   balk: number(),
   control: number(),
   movement: number(),
   stuff: number(),
   wildPitch: number(),
});

const VRowOotpPlayerRatingsPitchingSplits = object({
   l: VRowOotpPlayerRatingsPitchingSplitsValues,
   r: VRowOotpPlayerRatingsPitchingSplitsValues,
});

const VRowOotpPlayerRatingsPitching = object({
   balk: number(),
   control: number(),
   hold: number(),
   movement: number(),
   pitches: VRowOotpPlayerRatingsPitches,
   stamina: number(),
   stuff: number(),
   velocity: number(),
   wildPitch: number(),
   splits: VRowOotpPlayerRatingsPitchingSplits,
});

const VRowOotpPlayerPotentialPitching = object({
   balk: number(),
   control: number(),
   movement: number(),
   pitches: VRowOotpPlayerRatingsPitches,
   stuff: number(),
   wildPitch: number(),
});

const VRowOotpPlayerRatingsRunning = object({
   baserunning: number(),
   speed: number(),
   stealing: number(),
});

const VRowOotpPlayerRatingsFieldingCatcher = object({
   ability: number(),
   arm: number(),
});

const VRowOotpPlayerRatingsFieldingInfield = object({
   arm: number(),
   doublePlay: number(),
   error: number(),
   range: number(),
});

const VRowOotpPlayerRatingsFieldingOutfield = object({
   arm: number(),
   error: number(),
   range: number(),
});

const VRowOotpPlayerRatingsFieldingPositionRating = object({
   experience: number(),
   rating: number(),
});

const VRowOotpPlayerRatingsFieldingPosition = object({
   p: VRowOotpPlayerRatingsFieldingPositionRating,
   c: VRowOotpPlayerRatingsFieldingPositionRating,
   "1b": VRowOotpPlayerRatingsFieldingPositionRating,
   "2b": VRowOotpPlayerRatingsFieldingPositionRating,
   "3b": VRowOotpPlayerRatingsFieldingPositionRating,
   ss: VRowOotpPlayerRatingsFieldingPositionRating,
   lf: VRowOotpPlayerRatingsFieldingPositionRating,
   cf: VRowOotpPlayerRatingsFieldingPositionRating,
   rf: VRowOotpPlayerRatingsFieldingPositionRating,
});

const VRowOotpPlayerRatingsFielding = object({
   catcher: VRowOotpPlayerRatingsFieldingCatcher,
   infield: VRowOotpPlayerRatingsFieldingInfield,
   outfield: VRowOotpPlayerRatingsFieldingOutfield,
   position: VRowOotpPlayerRatingsFieldingPosition,
});

const VRowOotpPlayerRatings = object({
   batting: VRowOotpPlayerRatingsBatting,
   fielding: VRowOotpPlayerRatingsFielding,
   pitching: VRowOotpPlayerRatingsPitching,
   running: VRowOotpPlayerRatingsRunning,
});

const VRowOotpPlayerPotential = object({
   batting: VRowOotpPlayerPotentialBatting,
   pitching: VRowOotpPlayerPotentialPitching,
});

export const VRowOotpPlayer = object({
   bbRefId: string(),
   birthdate: string([VRegexDate]),
   firstName: string(),
   id: string([VRegexSlug]),
   lastName: string(),
   nickname: nullable(string()),
   idOotp: string(),
   position: VPickListGamePositions,
   potential: VRowOotpPlayerPotential,
   ratings: VRowOotpPlayerRatings,
   slug: string([VRegexSlug]),
   idTeam: nullable(string([VRegexSlug])),
});
export type TRowOotpPlayer = Input<typeof VRowOotpPlayer>;

export const VRowOotpLeague = object({
   abbrev: string(),
   id: string([VRegexSlug]),
   name: string(),
   idOotp: string(),
   slug: string([VRegexSlug]),
});
export type TRowOotpLeague = Input<typeof VRowOotpLeague>;

export const VRowOotpSubLeague = object({
   abbrev: string(),
   id: string([VRegexSlug]),
   idLeague: string([VRegexSlug]),
   name: string(),
   idOotp: string(),
   slug: string([VRegexSlug]),
});
export type TRowOotpSubLeague = Input<typeof VRowOotpSubLeague>;

export const VRowOotpDivision = object({
   id: string([VRegexSlug]),
   idLeague: string([VRegexSlug]),
   name: string(),
   idOotp: string(),
   slug: string([VRegexSlug]),
   idSubLeague: string([VRegexSlug]),
});
export type TRowOotpDivision = Input<typeof VRowOotpDivision>;

export const VRowOotpPark = object({
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
   id: string([VRegexSlug]),
   isHomeTeamDugoutAtFirstBase: boolean(),
   name: string(),
   idOotp: string([VRegexSlug]),
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
   slug: string([VRegexSlug]),
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
export type TRowOotpPark = Input<typeof VRowOotpPark>;

export const VRowOotpTeam = object({
   abbrev: string(),
   backgroundColor: string([VRegexHexColor]),
   idDivision: string([VRegexSlug]),
   hatMainColor: string([VRegexHexColor]),
   hatVisorColor: string([VRegexHexColor]),
   idHistorical: string(),
   id: string([VRegexSlug]),
   jerseyAwayColor: string([VRegexHexColor]),
   jerseyMainColor: string([VRegexHexColor]),
   jerseyPinStripeColor: string([VRegexHexColor]),
   jerseySecondaryColor: string([VRegexHexColor]),
   idLeague: string([VRegexSlug]),
   name: string(),
   nickname: string(),
   idOotp: string(),
   idPark: nullable(string([VRegexSlug])),
   slug: string([VRegexSlug]),
   idSubLeague: string([VRegexSlug]),
   textColor: string([VRegexHexColor]),
});
export type TRowOotpTeam = Input<typeof VRowOotpTeam>;

export const VRowOotpGame = object({
   date: string([VRegexDate]),
   id: string([VRegexSlug]),
   idLeague: string([VRegexSlug]),
   idTeamAway: string([VRegexSlug]),
   idTeamHome: string([VRegexSlug]),
   idOotp: string(),
   time: number([maxValue(2359)]),
});

export type TRowOotpGame = Input<typeof VRowOotpGame>;
