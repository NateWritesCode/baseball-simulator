import { handleValibotParse } from "@baseball-simulator/utils/functions";
import {
	VApiParamsGetIdPlayer,
	VApiResponseGetIdPlayer,
	VApiResponseGetPlayer,
} from "@baseball-simulator/utils/types";
import { vValidator } from "@hono/valibot-validator";
import type { TMiddleware } from "@server/server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const player = new Hono<{ Variables: TMiddleware["Variables"] }>()
	.get("/", (c) => {
		const db = c.var.db;

		const query = db.query(/* sql */ `
		select 
			persons.firstName, 
			persons.lastName,
			players.idPlayer 
		from 
			players
		inner join
			persons
		on
			players.idPerson = persons.idPerson
		;
		`);

		const [data, error] = handleValibotParse({
			data: query.all(),
			schema: VApiResponseGetPlayer,
		});

		if (error) {
			throw new HTTPException(500, {
				message: "There was an error fetching the data",
			});
		}

		return c.json(data);
	})
	.post("/:idPlayer", vValidator("json", VApiParamsGetIdPlayer), (c) => {
		const db = c.var.db;
		const params = c.req.valid("json");

		const query = db.prepare(/* sql */ `
		select 
			persons.firstName,
			persons.lastName,
			players.idPlayer
		from 
			players
		inner join
			persons
		on
			players.idPerson = persons.idPerson
		where 
			idPlayer = $idPlayer
		;
	`);

		const [data, error] = handleValibotParse({
			data: query.get(params),
			schema: VApiResponseGetIdPlayer,
		});

		if (error) {
			throw new HTTPException(500, {
				message: "There was an error fetching the data",
			});
		}

		return c.json(data);
	});

export default player;
