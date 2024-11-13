import { handleValibotParse } from "@baseball-simulator/utils/functions";
import {
	VApiParamsPostSelectTeam,
	VApiResponsePostSelectTeam,
	VDbQuerySelectTeam,
} from "@baseball-simulator/utils/types";
import { vValidator } from "@hono/valibot-validator";
import type { TMiddleware } from "@server/server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const team = new Hono<{ Variables: TMiddleware["Variables"] }>().post(
	"/selectTeam/:idLeague",
	vValidator("json", VApiParamsPostSelectTeam),
	(c) => {
		const db = c.var.db;
		const params = c.req.valid("json");

		const query = db.query(/* sql */ `
		select
            cities.name as 'city.name',
            idTeam,
            nickname
		from 
			teams
        inner join cities on teams.idCity = cities.idCity
		where 
			idLeague = $idLeague
		;
	`);

		const [dataSelectTeam, errorSelectTeam] = handleValibotParse({
			data: query.all({
				idLeague: Number(params.idLeague),
			}),
			schema: VDbQuerySelectTeam,
			shouldParseDotNotation: true,
		});

		if (errorSelectTeam) {
			throw new HTTPException(500, {
				message: "There was an error fetching the data",
			});
		}

		if (dataSelectTeam) {
			const [dataResponse, errorResponse] = handleValibotParse({
				data: dataSelectTeam,
				schema: VApiResponsePostSelectTeam,
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

export default team;
