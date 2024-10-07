import { type InferInput, array, intersect, pick } from "valibot";
import { VDbPersons, VDbPlayers } from "./tDb";

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
