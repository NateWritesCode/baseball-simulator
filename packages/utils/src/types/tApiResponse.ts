import { type InferInput, array, intersect, pick } from "valibot";
import { VDbPersons, VDbPlayers } from "./tDb";

export const VApiResponseGetPerson = array(
	intersect([pick(VDbPersons, ["firstName", "idPerson", "lastName"])]),
);
export type TApiResponseGetPerson = InferInput<typeof VApiResponseGetPerson>;

export const VApiResponseGetIdPerson = intersect([
	pick(VDbPersons, ["firstName", "idPerson", "lastName"]),
]);

export type TApiResponseGetIdPerson = InferInput<
	typeof VApiResponseGetIdPerson
>;

export const VApiResponseGetPlayer = array(
	intersect([
		pick(VDbPersons, ["firstName", "lastName"]),
		pick(VDbPlayers, ["idPlayer"]),
	]),
);
export type TApiResponseGetPlayer = InferInput<typeof VApiResponseGetPlayer>;

export const VApiResponseGetIdPlayer = intersect([
	pick(VDbPlayers, ["idPlayer"]),
	pick(VDbPersons, ["firstName", "lastName"]),
]);

export type TApiResponseGetIdPlayer = InferInput<
	typeof VApiResponseGetIdPlayer
>;
