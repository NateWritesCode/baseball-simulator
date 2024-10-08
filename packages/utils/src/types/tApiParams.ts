import { type InferInput, object, string } from "valibot";
import { VFormSchemaExplore } from "./tFormSchema";

export const VApiParamsGetIdPerson = object({
	idPerson: string(),
});
export type TApiParamsGetPerson = InferInput<typeof VApiParamsGetIdPerson>;

export const VApiParamsGetIdPlayer = object({
	idPlayer: string(),
});
export type TApiParamsGetPlayerId = InferInput<typeof VApiParamsGetIdPlayer>;

export const VApiParamsExplore = VFormSchemaExplore;
export type TApiParamsExplore = InferInput<typeof VApiParamsExplore>;
