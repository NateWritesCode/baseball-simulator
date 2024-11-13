import { handleValibotParse } from "@baseball-simulator/utils/functions";
import {
	VApiResponseGetUniverse,
	VDbQueryUniverseDateTime,
} from "@baseball-simulator/utils/types";
import type { TMiddleware } from "@server/server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const universe = new Hono<{ Variables: TMiddleware["Variables"] }>().get(
	"/",
	(c) => {
		const db = c.var.db;

		const dbQueryUniverse = db.query(/* sql */ `
            select
                dateTime
            from 
                universe
            ;
	    `);

		const [dataQueryUniverse, errorQueryStandings] = handleValibotParse({
			data: dbQueryUniverse.get(),
			schema: VDbQueryUniverseDateTime,
		});

		if (errorQueryStandings) {
			throw new HTTPException(500, {
				message: "There was an error fetching the data",
			});
		}

		const [dataResponse, errorResponse] = handleValibotParse({
			data: dataQueryUniverse,
			schema: VApiResponseGetUniverse,
		});

		if (dataResponse) {
			return c.json(dataResponse);
		}

		throw new HTTPException(500, {
			message: "There was an error fetching the data",
		});
	},
);

export default universe;
