import { handleValibotParse } from "@baseball-simulator/utils/functions";
import {
	VApiParamsGetIdGame,
	VApiResponseGetIdGame,
} from "@baseball-simulator/utils/types";
import { vValidator } from "@hono/valibot-validator";
import type { TMiddleware } from "@server/server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const game = new Hono<{ Variables: TMiddleware["Variables"] }>().post(
	"/:idGame",
	vValidator("json", VApiParamsGetIdGame),
	(c) => {
		const db = c.var.db;
		const params = c.req.valid("json");

		const query = db.query(/* sql */ `
		select
			boxScore,
			idGame 
		from 
			games
		where 
			idGame = $idGame
		;
	`);

		const [data, error] = handleValibotParse({
			data: query.get(params),
			schema: VApiResponseGetIdGame,
		});

		if (error) {
			throw new HTTPException(500, {
				message: "There was an error fetching the data",
			});
		}

		return c.json(data);
	},
);

export default game;
