import { type InferInput, picklist } from "valibot";
import { DIRECTIONS, SIMULATION_LENGTH_OPTIONS } from "../constants";
import {
	GAME_SIM_EVENTS,
	PITCH_IN_PLAY_EVENTS,
	PITCH_NAMES,
	PITCH_OUTCOMES,
	POSITIONS,
} from "../constants/cBaseball";
import { ROOF_TYPES, SURFACE_TYPES } from "../constants/cPark";

export const VPicklistPitchInPlayEvents = picklist([...PITCH_IN_PLAY_EVENTS]);
export type TPicklistPitchInPlayEvents = InferInput<
	typeof VPicklistPitchInPlayEvents
>;

export const VPicklistPitchNames = picklist([...PITCH_NAMES]);
export type TPicklistPitchNames = InferInput<typeof VPicklistPitchNames>;

export const VPicklistPitchOutcomes = picklist([...PITCH_OUTCOMES]);
export type TPicklistPitchOutcomes = InferInput<typeof VPicklistPitchOutcomes>;

export const VPicklistPositions = picklist([...POSITIONS]);
export type TPicklistPositions = InferInput<typeof VPicklistPositions>;

export const VPicklistRoofType = picklist([...ROOF_TYPES]);
export type TPicklistRoofType = InferInput<typeof VPicklistRoofType>;

export const VPicklistSurfaceType = picklist([...SURFACE_TYPES]);
export type TPicklistSurfaceType = InferInput<typeof VPicklistSurfaceType>;

export const VPicklistDirections = picklist([...DIRECTIONS]);
export type TPicklistDirections = InferInput<typeof VPicklistDirections>;

export const VPicklistSimuationLengthOptions = picklist([
	...SIMULATION_LENGTH_OPTIONS,
]);
export type TPicklistSimuationLengthOptions = InferInput<
	typeof VPicklistSimuationLengthOptions
>;

export const VPicklistGameSimEvents = picklist([...GAME_SIM_EVENTS]);
export type TPicklistGameSimEvents = InferInput<typeof VPicklistGameSimEvents>;
