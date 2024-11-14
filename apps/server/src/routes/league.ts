import { handleValibotParse } from "@baseball-simulator/utils/functions";
import {
	VApiParamsPostIdLeague,
	VApiParamsPostIdLeagueIdGameGroupLeaders,
	VApiResponsePostIdLeague,
	VApiResponsePostIdLeagueIdGameGroupLeaders,
	VApiResponsePostSelectLeague,
	VDbQueryLeagueGameGroupLeaders,
	VDbQuerySelectLeague,
} from "@baseball-simulator/utils/types";
import { vValidator } from "@hono/valibot-validator";
import type { TMiddleware } from "@server/server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const league = new Hono<{ Variables: TMiddleware["Variables"] }>()
	.get("/selectLeague", (c) => {
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
	})
	.post("/:idLeague", vValidator("json", VApiParamsPostIdLeague), (c) => {
		const db = c.var.db;
		const params = c.req.valid("json");

		const query = db.query(
			/* sql */ `
		select 
			idLeague
		from 
			leagues
		where 
			leagues.idLeague = $idLeague
		;
	`,
		);

		const [dataResponse, errorResponse] = handleValibotParse({
			data: query.get({
				idLeague: Number(params.idLeague),
			}),
			schema: VApiResponsePostIdLeague,
		});

		if (dataResponse) {
			return c.json(dataResponse);
		}

		throw new HTTPException(500, {
			message: "There was an error fetching the data",
		});
	})
	.post(
		"/:idLeague/gameGroup/:idGameGroup/leaders",
		vValidator("json", VApiParamsPostIdLeagueIdGameGroupLeaders),
		(c) => {
			const db = c.var.db;
			const params = c.req.valid("json");

			const queryGameGroupLeaders = db.query(/* sql */ `
-- Batting Statistics Top 10s
with battingStats as (
    select 
        cities.name as 'team.city.name',
        persons.firstName,
        persons.idPerson,
        persons.lastName,
        players.idPlayer,
        statisticsPlayerGameGroupBatting.ab,
        statisticsPlayerGameGroupBatting.doubles,
        statisticsPlayerGameGroupBatting.h,
        statisticsPlayerGameGroupBatting.hr,
        statisticsPlayerGameGroupBatting.k,
        statisticsPlayerGameGroupBatting.rbi,
        statisticsPlayerGameGroupBatting.runs,
        statisticsPlayerGameGroupBatting.sb,
        teams.idTeam as 'team.idTeam',
        teams.nickname as 'team.nickname',
        round(cast(statisticsPlayerGameGroupBatting.h as real) / case when statisticsPlayerGameGroupBatting.ab = 0 then 1 else statisticsPlayerGameGroupBatting.ab end, 3) as avg
    from statisticsPlayerGameGroupBatting
    inner join players on players.idPlayer = statisticsPlayerGameGroupBatting.idPlayer
    inner join persons on persons.idPerson = players.idPerson
    inner join teams on teams.idTeam = statisticsPlayerGameGroupBatting.idTeam
    inner join cities on cities.idCity = teams.idCity
    -- where statisticsPlayerGameGroupBatting.ab >= 100
)

select * from (
    select 'avg' as statType, 'batting' as statCategory, firstName, idPerson, lastName, 
        "team.city.name", "team.idTeam", "team.nickname",
        avg as statValue,
        row_number() over (order by avg desc, lastName, firstName) as numRank
    from battingStats
) where numRank <= 10

union all

select * from (
    select 'hr' as statType, 'batting' as statCategory, firstName, idPerson, lastName, 
        "team.city.name", "team.idTeam", "team.nickname",
        hr as statValue,
        row_number() over (order by hr desc, lastName, firstName) as numRank
    from battingStats
) where numRank <= 10

union all

select * from (
    select 'rbi' as statType, 'batting' as statCategory, firstName, idPerson, lastName, 
        "team.city.name", "team.idTeam", "team.nickname",
        rbi as statValue,
        row_number() over (order by rbi desc, lastName, firstName) as numRank
    from battingStats
) where numRank <= 10

union all

select * from (
    select 'sb' as statType, 'batting' as statCategory, firstName, idPerson, lastName, 
        "team.city.name", "team.idTeam", "team.nickname",
        sb as statValue,
        row_number() over (order by sb desc, lastName, firstName) as numRank
    from battingStats
) where numRank <= 10;

-- Pitching Statistics Top 10s
with pitchingStats as (
    select 
        cities.name as 'team.city.name',
        persons.firstName,
        persons.idPerson,
        persons.lastName,
        players.idPlayer,
        statisticsPlayerGameGroupPitching.bb,
        statisticsPlayerGameGroupPitching.hitsAllowed,
        statisticsPlayerGameGroupPitching.k,
        statisticsPlayerGameGroupPitching.outs,
        statisticsPlayerGameGroupPitching.runsEarned,
        teams.idTeam as 'team.idTeam',
        teams.nickname as 'team.nickname',
        round(cast(statisticsPlayerGameGroupPitching.runsEarned * 27 as real) / statisticsPlayerGameGroupPitching.outs, 2) as era,
        round(cast(statisticsPlayerGameGroupPitching.k * 27 as real) / statisticsPlayerGameGroupPitching.outs, 1) as k9,
        round(cast(statisticsPlayerGameGroupPitching.bb * 27 as real) / statisticsPlayerGameGroupPitching.outs, 1) as bb9,
        round(cast(statisticsPlayerGameGroupPitching.k as real) / case when statisticsPlayerGameGroupPitching.bb = 0 then 1 else statisticsPlayerGameGroupPitching.bb end, 1) as kbb
    from statisticsPlayerGameGroupPitching
    inner join players on players.idPlayer = statisticsPlayerGameGroupPitching.idPlayer
    inner join persons on persons.idPerson = players.idPerson
    inner join teams on teams.idTeam = statisticsPlayerGameGroupPitching.idTeam
    inner join cities on cities.idCity = teams.idCity
    -- where statisticsPlayerGameGroupPitching.outs >= 10
)

select * from (
    select 'era' as statType, 'pitching' as statCategory, firstName, idPerson, lastName, 
        "team.city.name", "team.idTeam", "team.nickname",
        era as statValue,
        row_number() over (order by era asc, lastName, firstName) as numRank
    from pitchingStats
) where numRank <= 10

union all

select * from (
    select 'k/9' as statType, 'pitching' as statCategory, firstName, idPerson, lastName, 
        "team.city.name", "team.idTeam", "team.nickname",
        k9 as statValue,
        row_number() over (order by k9 desc, lastName, firstName) as numRank
    from pitchingStats
) where numRank <= 10

union all

select * from (
    select 'bb/9' as statType, 'pitching' as statCategory, firstName, idPerson, lastName, 
        "team.city.name", "team.idTeam", "team.nickname",
        bb9 as statValue,
        row_number() over (order by bb9 asc, lastName, firstName) as numRank
    from pitchingStats
) where numRank <= 10

union all

select * from (
    select 'k/bb' as statType, 'pitching' as statCategory, firstName, idPerson, lastName, 
        "team.city.name", "team.idTeam", "team.nickname",
        kbb as statValue,
        row_number() over (order by kbb desc, lastName, firstName) as numRank
    from pitchingStats
) where numRank <= 10;
			`);

			const myTest = queryGameGroupLeaders.all();

			const [dataLeagueGameGroupLeaders, errorLeagueGameGroupLeaders] =
				handleValibotParse({
					data: myTest,
					schema: VDbQueryLeagueGameGroupLeaders,
					shouldParseDotNotation: true,
				});

			if (dataLeagueGameGroupLeaders && dataLeagueGameGroupLeaders.length > 0) {
				const [dataResponse, errorResponse] = handleValibotParse({
					data: dataLeagueGameGroupLeaders,
					schema: VApiResponsePostIdLeagueIdGameGroupLeaders,
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
