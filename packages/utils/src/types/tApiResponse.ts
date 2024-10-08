import { type InferInput, array, intersect, object, omit, pick } from "valibot";
import {
	VDbCities,
	VDbCountries,
	VDbPersons,
	VDbPersonsAlignment,
	VDbPersonsMental,
	VDbPersonsMyersBriggs,
	VDbPersonsPhysical,
	VDbPlayers,
	VDbStates,
} from "./tDb";

export const VApiResponseGetPerson = array(
	intersect([pick(VDbPersons, ["firstName", "idPerson", "lastName"])]),
);
export type TApiResponseGetPerson = InferInput<typeof VApiResponseGetPerson>;

export const VApiResponseGetIdPerson = intersect([
	pick(VDbPersons, [
		"dateOfBirth",
		"firstName",
		"idPerson",
		"lastName",
		"middleName",
		"nickname",
	]),
	object({
		birthplace: object({
			city: pick(VDbCities, ["idCity", "name"]),
			country: pick(VDbCountries, ["idCountry", "name"]),
			state: pick(VDbStates, ["idState", "name"]),
		}),
	}),
	object({
		alignment: omit(VDbPersonsAlignment, ["idPerson"]),
	}),
	object({
		mental: omit(VDbPersonsMental, ["idPerson"]),
	}),
	object({
		myersBriggs: omit(VDbPersonsMyersBriggs, ["idPerson"]),
	}),
	object({
		physical: omit(VDbPersonsPhysical, ["idPerson"]),
	}),
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