import { handleValibotParse } from "@baseball-simulator/utils/functions";
import {
	VApiParamsGetStandings,
	VApiResponseGetStandings,
	VDbQueryStandings,
	VDbQueryStandingsTeams,
} from "@baseball-simulator/utils/types";
import { vValidator } from "@hono/valibot-validator";
import type { TMiddleware } from "@server/server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const standings = new Hono<{ Variables: TMiddleware["Variables"] }>().post(
	"/:idGameGroup",
	vValidator("json", VApiParamsGetStandings),
	(c) => {
		const db = c.var.db;
		const params = c.req.valid("json");

		const dbQueryStandings = db.query(/* sql */ `
            select
                standings
            from 
                gameGroups
            where 
                idGameGroup = $idGameGroup
            ;
	    `);

		const [dataQueryStandings, errorQueryStandings] = handleValibotParse({
			data: dbQueryStandings.get(params),
			schema: VDbQueryStandings,
		});

		if (errorQueryStandings) {
			throw new HTTPException(500, {
				message: "There was an error fetching the data",
			});
		}

		if (dataQueryStandings.standings) {
			const idTeams = Object.keys(dataQueryStandings.standings).map(Number);
			const dbQueryStandingsTeams = db.query(/* sql */ `
                select 
                    cities.name as "city.name",
                    divisions.direction as "division.direction",
                    divisions.idDivision as "division.idDivision",
                    divisions.name as "division.name",
                    leagues.idLeague as "league.idLeague",
                    leagues.name as "league.name",
                    subLeagues.idSubLeague as "subLeague.idSubLeague",
                    subLeagues.name as "subLeague.name",
                    teams.idTeam,
                    teams.nickname
                from teams
                inner join cities on cities.idCity = teams.idCity
                inner join leagues on leagues.idLeague = teams.idLeague
                left join divisions on divisions.idDivision = teams.idDivision
                inner join subLeagues on subLeagues.idSubLeague = teams.idSubLeague
                where teams.idTeam in (${idTeams.map((v) => "?").join(",")})
                order by teams.nickname
                ;
        `);

			const [dataQueryStandingsTeams, errorQueryStandingsTeams] =
				handleValibotParse({
					data: dbQueryStandingsTeams.all(...idTeams),
					schema: VDbQueryStandingsTeams,
					shouldParseDotNotation: true,
				});

			if (errorQueryStandingsTeams) {
				throw new HTTPException(500, {
					message: "There was an error fetching the data",
				});
			}

			if (dataQueryStandingsTeams && dataQueryStandingsTeams.length > 0) {
				const returnData = dataQueryStandingsTeams.map((team) => {
					return {
						...team,
						...dataQueryStandings.standings[team.idTeam],
					};
				});

				const [dataResponse, errorResponse] = handleValibotParse({
					data: returnData,
					schema: VApiResponseGetStandings,
				});

				if (errorResponse) {
					throw new HTTPException(500, {
						message: "There was an error fetching the data",
					});
				}

				return c.json(dataResponse);
			}
		}

		throw new HTTPException(500, {
			message: "There was an error fetching the data",
		});
	},
);

export default standings;
