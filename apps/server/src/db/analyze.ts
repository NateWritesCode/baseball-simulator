import { Database } from "bun:sqlite";

export default async () => {
	const db = new Database(
		"/home/nathanh81/Projects/baseball-simulator/apps/server/src/db/baseball-simulator.db",
		{
			strict: true,
		},
	);

	const toJson = db
		.query(/*sql*/ `
with game_count as (
   select count(*) as totalGames
   from gameSimEvents
   where gameSimEvent = 'gameStart'
),
plate_appearances as (
   select count(*) as totalPa
   from gameSimEvents
   where gameSimEvent in ('double', 'out', 'strikeout', 'walk', 'single', 'hitByPitch', 'homeRun', 'triple')
),
total_pitches as (
   select count(*) as totalPitches
   from gameSimEvents
   where gameSimEvent = 'pitch'
),
batting_outcomes as (
   select 
       'battingOutcomes' as analysisType,
       gameSimEvent as type,
       count(*) as count,
       round(count(*) * 100.0 / sum(count(*)) over (), 2) as percentage,
       round(cast(count(*) as float) / (select totalGames from game_count), 2) as perGame
   from gameSimEvents
   where gameSimEvent in ('double', 'foul', 'hitByPitch', 'homeRun', 'out', 'run', 'single', 'strikeout', 'triple', 'walk')
   group by gameSimEvent
),
key_metrics as (
   select 
       'keyMetrics' as analysisType,
       'onBasePercentage' as type,
       round(1000 * cast(count(*) as float) / sum(case when gameSimEvent in ('double', 'out', 'strikeout', 'walk', 'single', 'hitByPitch', 'homeRun', 'triple') then 1 else 0 end), 0) as count,
       null as percentage,
       null as perGame
   from gameSimEvents
   where gameSimEvent in ('walk', 'single', 'double', 'hitByPitch', 'homeRun', 'triple')

   union all

   select 
       'keyMetrics',
       'battingAverage',
       round(1000 * cast(count(*) as float) / sum(case when gameSimEvent in ('double', 'out', 'strikeout', 'single', 'homeRun', 'triple') then 1 else 0 end), 0),
       null,
       null
   from gameSimEvents
   where gameSimEvent in ('single', 'double', 'homeRun', 'triple')

   union all

   select 
       'keyMetrics',
       'pitchesPerPlateAppearance',
       round(cast(totalPitches as float) / totalPa, 2),
       null,
       null
   from total_pitches, plate_appearances
),
pitch_outcomes as (
   select 
       'pitchOutcomes' as analysisType,
       pitchOutcome as type,
       count(*) as count,
       round(count(*) * 100.0 / sum(count(*)) over(), 2) as percentage,
       round(cast(count(*) as float) / (select totalGames from game_count), 2) as perGame
   from gameSimEvents 
   where pitchOutcome is not null 
   group by pitchOutcome
),
pitch_types as (
   select 
       'pitchTypes' as analysisType,
       pitchName as type,
       count(*) as count,
       round(count(*) * 100.0 / sum(count(*)) over(), 2) as percentage,
       round(cast(count(*) as float) / (select totalGames from game_count), 2) as perGame
   from gameSimEvents 
   where pitchName is not null 
   group by pitchName
)
select *
from (
   select * from batting_outcomes
   union all
   select * from key_metrics
   union all
   select * from pitch_outcomes
   union all
   select * from pitch_types
)
order by 
   case analysisType 
       when 'battingOutcomes' then 1
       when 'keyMetrics' then 2 
       when 'pitchOutcomes' then 3
       when 'pitchTypes' then 4
   end,
   count desc;
    `)
		.all();

	// Pitch type, name, location

	// const toJson = db
	// 	.query(/*sql*/ `
	// select
	//     avg(json_extract(pitchLocation, '$.releaseSpeed')) as avgVelocity,
	//     avg(json_extract(pitchLocation, '$.pfxX')) as avgHorizontalBreak,
	//     avg(json_extract(pitchLocation, '$.pfxZ')) as avgVerticalBreak,
	//     count(*) as totalPitches,
	//     pitchName,
	//     pitchOutcome,
	//     round(count(*) * 100.0 / sum(count(*)) over (), 2) as percentageOfTotal
	// from gameSimEvents
	// where pitchLocation is not null
	// and pitchName is not null
	// group by
	//     pitchName,
	//     pitchOutcome
	// order by
	//     pitchName,
	//     pitchOutcome;
	// `)
	// 	.all();

	await Bun.write(
		"/home/nathanh81/Projects/baseball-simulator/apps/server/src/db/analyze.json",
		JSON.stringify(toJson, null, 2),
	);
	console.info("Analyze complete");
};
