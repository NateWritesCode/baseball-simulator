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
			persons.firstName,
            persons.idPerson,
			persons.lastName
		from 
            persons
		where 
			idPerson = $idPerson
		;
	`);

		const [data, error] = handleValibotParse({
			data: query.get(params),
			schema: VApiResponseGetIdPerson,
		});

		if (error) {
			throw new HTTPException(500, {
				message: "There was an error fetching the data",
			});
		}

		return c.json(data);
	});

export default person;
