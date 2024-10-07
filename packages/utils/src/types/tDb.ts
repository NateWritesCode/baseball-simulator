import { nullable, number, object, string } from "valibot";

export const VDbPlayers = object({
	idPerson: number(),
	idPlayer: number(),
	idTeam: nullable(number()),
});

export const VDbPersons = object({
	firstName: string(),
	idPerson: number(),
	lastName: string(),
});
