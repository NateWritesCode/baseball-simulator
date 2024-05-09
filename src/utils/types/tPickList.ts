import { type Input, picklist } from "valibot";
import {
   COLOR_TOKENS,
   COMPASS_POINTS,
   GENDER_CIS,
   GENDER_IDENTITY,
   GENDER_SETTING,
   POSITIONS,
} from "../constants";

export const VPickListGenderCis = picklist(GENDER_CIS);
export type TPickListGenderCis = Input<typeof VPickListGenderCis>;

export const VPickListGenderIdentity = picklist(GENDER_IDENTITY);
export type TPickListGenderIdentity = Input<typeof VPickListGenderIdentity>;

export const VPickListGenderSetting = picklist(GENDER_SETTING);
export type TPickListGenderSetting = Input<typeof VPickListGenderSetting>;

export const SIMULATOR_TYPES = ["baseball"] as const;
export const VPickListSimulatorTypes = picklist(SIMULATOR_TYPES);
export type TPickListSimulatorTypes = Input<typeof VPickListSimulatorTypes>;

export const VPickListColorTokens = picklist(COLOR_TOKENS);
export type TPickListColorTokens = Input<typeof VPickListColorTokens>;

export const VPickListCompassPoints = picklist(COMPASS_POINTS);
export type TPickListCompassPoints = Input<typeof VPickListCompassPoints>;

export const VPickListGamePositions = picklist([...POSITIONS]);
