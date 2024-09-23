import { handleValibotParse } from "@baseball-simulator/utils/functions";
import {
	VApiParamsGetIdPlayer,
	VApiResponseGetIdPlayer,
	VApiResponseGetPlayer,
} from "@baseball-simulator/utils/types";
import { vValidator } from "@hono/valibot-validator";
import type { TMiddleware } from "@server/server";
import { Hono } from "hono";

const player = new Hono<{ Variables: TMiddleware["Variables"] }>()
	.get("/", (c) => {
		const db = c.var.db;

		const query = db.query(/* sql */ `
		select 
			firstName, lastName 
		from 
			persons
		`);
		const data = query.all();

		return c.json(
			handleValibotParse({
				data,
				schema: VApiResponseGetPlayer,
			}),
		);
	})
	.get("/:idPlayer", vValidator("json", VApiParamsGetIdPlayer), (c) => {
		const db = c.var.db;
		const params = c.req.valid("json");

		const query = db.prepare(/* sql */ `
		select 
			firstName,
			lastName
		from 
			players
		where 
			idPlayer = $idPlayer
		;
	`);
		const data = query.get(params);

		return c.json(
			handleValibotParse({
				data,
				schema: VApiResponseGetIdPlayer,
			}),
		);
	});

export default player;
