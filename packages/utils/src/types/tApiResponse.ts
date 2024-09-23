import { type InferInput, array, pick } from "valibot";
import { VDbPlayer } from "./tDb";

export const VApiResponseGetPlayer = array(
	pick(VDbPlayer, ["firstName", "lastName"]),
);
export type TApiResponseGetPlayer = InferInput<typeof VApiResponseGetPlayer>;

export const VApiResponseGetIdPlayer = pick(VDbPlayer, [
	"firstName",
	"lastName",
]);
