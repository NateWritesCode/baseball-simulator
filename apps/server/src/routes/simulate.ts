import { handleValibotParse } from "@baseball-simulator/utils/functions";
import {
	VDbGames,
	VDbPersons,
	VDbPersonsAlignment,
	VDbPersonsMental,
	VDbPersonsMyersBriggs,
	VDbPersonsPhysical,
	VDbPlayers,
	VDbTeams,
} from "@baseball-simulator/utils/types";
import type { TMiddleware } from "@server/server";
import { Hono } from "hono";
import { array, intersect, object, omit, pick } from "valibot";

const VGamesTeam = intersect([
	pick(VDbTeams, ["idTeam", "nickname"]),
	object({
		players: array(
			intersect([
				pick(VDbPlayers, ["idPerson", "idPlayer"]),
				object({
					person: pick(VDbPersons, ["idPerson", "firstName", "lastName"]),
				}),
				object({
					alignment: omit(VDbPersonsAlignment, ["idPerson"]),
				}),
				object({
					mental: omit(VDbPersonsMental, ["idPerson"]),
				}),
				object({
					myersBriggs: omit(VDbPersonsMyersBriggs, ["idPerson"]),
				}),
				object({
					physical: omit(VDbPersonsPhysical, ["idPerson"]),
				}),
			]),
		),
	}),
]);

const VGames = array(VDbGames);

const queryGames = /* sql */ `
    with myUniverse as (
        select
            dateTime
        from
            universe
    )
    select
        dateTime,
        idGame,
        idTeamAway,
        idTeamHome
    from
        games
    where
        dateTime = (select dateTime from myUniverse)
    ;
`;

const queryTeams = /* sql */ `
    select
        idTeam,
        nickname
    from
        teams
    where
        idTeam = ?
    ;
`;

const queryPlayers = /* sql */ `
    select
        idPerson,
        idPlayer,
        idTeam
    from
        players
    where
        idTeam = ?
    ;
`;

const simulate = new Hono<{ Variables: TMiddleware["Variables"] }>().post(
	"/simulate",
	(c) => {
		const db = c.var.db;

		const prepareGames = db.prepare(
			/* sql */ `
                with myUniverse as (
                    select
                        dateTime
                    from
                        universe
                )
                select
                    dateTime,
                    idGame,
                    idTeamAway,
                    idTeamHome
                from
                    games
                where
                    dateTime = (select dateTime from myUniverse)
                ;
            `,
		);

		const [games, error] = handleValibotParse({
			data: prepareGames.all(),
			schema: VGames,
		});

		if (error) {
			return c.text("Internal Server Error", 500);
		}

		const gamesToSimulate = games.map((game) => {
			const prepareTeams = db.prepare(
				/* sql */ `
                    select
                        idTeam,
                        nickname
                    from
                        teams
                    where
                        idTeam = ?
                    ;
                `,
			);

			return {};
		});

		return c.text("OK", 200);
	},
);

export default simulate;
