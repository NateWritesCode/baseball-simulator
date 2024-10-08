import { nullable, number, object, pipe, regex, string } from "valibot";

export const VDbCities = object({
	idCity: number(),
	idState: number(),
	latitude: number(),
	longitude: number(),
	name: string(),
});

export const VDbContinents = object({
	abbreviation: string(),
	idContinent: number(),
	name: string(),
});

export const VDbCountries = object({
	abbreviation: string(),
	idContinent: number(),
	idCountry: number(),
	name: string(),
});

export const VDbPlayers = object({
	idPerson: number(),
	idPlayer: number(),
	idTeam: nullable(number()),
});

export const VDbPersons = object({
	dateOfBirth: pipe(string(), regex(/^\d{4}-\d{2}-\d{2}$/)),
	firstName: string(),
	idPerson: number(),
	lastName: string(),
	middleName: nullable(string()),
	nickname: nullable(string()),
});

export const VDbPersonsAlignment = object({
	chaotic: number(),
	evil: number(),
	good: number(),
	idPerson: number(),
	lawful: number(),
	neutralMorality: number(),
	neutralOrder: number(),
});
export const VDbPersonsMental = object({
	charisma: number(),
	constitution: number(),
	idPerson: number(),
	intelligence: number(),
	loyalty: number(),
	wisdom: number(),
	workEthic: number(),
});
export const VDbPersonsMyersBriggs = object({
	extroversion: number(),
	feeling: number(),
	idPerson: number(),
	introversion: number(),
	intuition: number(),
	judging: number(),
	perceiving: number(),
	sensing: number(),
	thinking: number(),
});
export const VDbPersonsPhysical = object({
	height: number(),
	idPerson: number(),
	weight: number(),
});

export const VDbStates = object({
	abbreviation: string(),
	idCountry: number(),
	idState: number(),
	name: string(),
});
