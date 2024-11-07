import { Database } from "bun:sqlite";

const db = new Database("./baseball-simulator.db", {
	strict: true,
});

const toJson = db
	.query(/*sql*/ `
with gameEvents as (
    select count(*) as totalGameEvents
    from gameSimEvents 
    where gameSimEvent in ('single', 'double', 'triple', 'out', 'strikeout')
),
pitchEvents as (
    select count(*) as totalPitchEvents
    from gameSimEvents 
    where gameSimEvent = 'pitch' and pitchOutcome is not null
)
select 
    'Game Events' as analysisType,
    gameSimEvent as type,
    count(*) as count,
    round(cast(count(*) as float) / (select totalGameEvents from gameEvents) * 100, 2) as percentage
from gameSimEvents
where gameSimEvent in ('single', 'double', 'triple', 'out', 'strikeout')
group by gameSimEvent

union all

select 
    'Pitch Outcomes' as analysisType,
    pitchOutcome as type,
    count(*) as count,
    round(cast(count(*) as float) / (select totalPitchEvents from pitchEvents) * 100, 2) as percentage
from gameSimEvents
where gameSimEvent = 'pitch' and pitchOutcome is not null
group by pitchOutcome
order by analysisType, count desc;
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

await Bun.write("./analyze.json", JSON.stringify(toJson, null, 2));
