import { handleValibotParse } from "@baseball-simulator/utils/functions";
import {
	VApiParamsGetIdPerson,
	VApiResponseGetIdPerson,
	VApiResponseGetPerson,
} from "@baseball-simulator/utils/types";
import { vValidator } from "@hono/valibot-validator";
import type { TMiddleware } from "@server/server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const person = new Hono<{ Variables: TMiddleware["Variables"] }>()
	.get("/", (c) => {
		const db = c.var.db;

		const query = db.query(/* sql */ `
		select 
			persons.firstName,
            persons.idPerson, 
			persons.lastName
		from 
			persons
		;
		`);

		const [data, error] = handleValibotParse({
			data: query.all(),
			schema: VApiResponseGetPerson,
		});

		if (error) {
			throw new HTTPException(500, {
				message: "There was an error fetching the data",
			});
		}

		return c.json(data);
	})
	.post("/:idPerson", vValidator("json", VApiParamsGetIdPerson), (c) => {
		const db = c.var.db;
		const params = c.req.valid("json");

		const query = db.prepare(/* sql */ `
		select 
			cities.idCity as "birthplace.city.idCity",
			cities.name as "birthplace.city.name",
			countries.idCountry as "birthplace.country.idCountry",
			countries.name as "birthplace.country.name",
			persons.dateOfBirth,
			persons.firstName,
			persons.idCityOfBirth,
            persons.idPerson,
			persons.lastName,
			persons.middleName,
			persons.nickname,
			personsAlignment.chaotic as "alignment.chaotic",
			personsAlignment.evil as "alignment.evil",
			personsAlignment.good as "alignment.good",
			personsAlignment.lawful as "alignment.lawful",
			personsAlignment.neutralMorality as "alignment.neutralMorality",
			personsAlignment.neutralOrder as "alignment.neutralOrder",
			personsMyersBriggs.extroversion as "myersBriggs.extroversion",
			personsMyersBriggs.feeling as "myersBriggs.feeling",
			personsMyersBriggs.introversion as "myersBriggs.introversion",
			personsMyersBriggs.intuition as "myersBriggs.intuition",
			personsMyersBriggs.judging as "myersBriggs.judging",
			personsMyersBriggs.perceiving as "myersBriggs.perceiving",
			personsMyersBriggs.sensing as "myersBriggs.sensing",
			personsMyersBriggs.thinking as "myersBriggs.thinking",
			personsMental.charisma as "mental.charisma",
			personsMental.constitution as "mental.constitution",
			personsMental.intelligence as "mental.intelligence",
			personsMental.loyalty as "mental.loyalty",
			personsMental.wisdom as "mental.wisdom",
			personsMental.workEthic as "mental.workEthic",
			personsPhysical.height as "physical.height",
			personsPhysical.weight as "physical.weight",
			states.idState as "birthplace.state.idState",
			states.name as "birthplace.state.name"
		from 
            persons
		left join cities on persons.idCityOfBirth = cities.idCity
		left join states on cities.idState = states.idState
		left join countries on states.idCountry = countries.idCountry
		left join personsAlignment on persons.idPerson = personsAlignment.idPerson
		left join personsMyersBriggs on persons.idPerson = personsMyersBriggs.idPerson
		left join personsMental on persons.idPerson = personsMental.idPerson
		left join personsPhysical on persons.idPerson = personsPhysical.idPerson
		where 
			persons.idPerson = $idPerson
		;
	`);

		const [data, error] = handleValibotParse({
			data: query.get(params),
			schema: VApiResponseGetIdPerson,
			shouldParseDotNotation: true,
		});

		if (error) {
			throw new HTTPException(500, {
				message: "There was an error fetching the data",
			});
		}

		return c.json(data);
	});

export default person;
