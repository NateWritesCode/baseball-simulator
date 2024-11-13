import { handleValibotParse } from "@baseball-simulator/utils/functions";
import {
	VApiResponsePostSelectLeague,
	VDbQuerySelectLeague,
} from "@baseball-simulator/utils/types";
import type { TMiddleware } from "@server/server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const league = new Hono<{ Variables: TMiddleware["Variables"] }>().get(
	"/selectLeague",
	(c) => {
		const db = c.var.db;

		const queryLeagues = db.query(/* sql */ `
		select
			idLeague,
            name
		from 
			leagues
		;
	`);

		const [dataLeagues, errorLeagues] = handleValibotParse({
			data: queryLeagues.all(),
			schema: VDbQuerySelectLeague,
		});

		if (errorLeagues) {
			throw new HTTPException(500, {
				message: "There was an error fetching the data",
			});
		}

		if (dataLeagues) {
			const [dataResponse, errorResponse] = handleValibotParse({
				data: dataLeagues,
				schema: VApiResponsePostSelectLeague,
			});

			if (dataResponse) {
				return c.json(dataResponse);
			}
		}

		throw new HTTPException(500, {
			message: "There was an error fetching the data",
		});
	},
);

export default league;
