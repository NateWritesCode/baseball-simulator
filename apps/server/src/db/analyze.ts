import { Database } from "bun:sqlite";

const db = new Database("./baseball-simulator.db", {
	strict: true,
});

const toJson = db
	.query(/*sql*/ `
with gameEvents as (
    select count(*) as totalGameEvents
    from gameSimEvents 
    where gameSimEvent in ('double', 'flyout', 'groundout', 'homerun', 'lineout', 'out', 'popout', 'single', 'strikeout', 'triple', 'walk')
),
pitchEvents as (
    select count(*) as totalPitchEvents
    from gameSimEvents 
    where gameSimEvent = 'pitch' and pitchOutcome is not null
),
plateAppearances as (
    select count(distinct idGame || idPlayerHitter) as totalPAs
    from gameSimEvents 
    where gameSimEvent in ('double', 'flyout', 'groundout', 'homerun', 'lineout', 'out', 'popout', 'single', 'strikeout', 'triple', 'walk')
),
atBats as (
    select count(distinct idGame || idPlayerHitter) as totalABs
    from gameSimEvents 
    where gameSimEvent in ('double', 'flyout', 'groundout', 'homerun', 'lineout', 'out', 'popout', 'single', 'strikeout', 'triple')
),
battedBallEvents as (
    select count(*) as totalBattedBalls
    from gameSimEvents 
    where gameSimEvent in ('double', 'flyout', 'groundout', 'homerun', 'lineout', 'popout', 'single', 'triple')
)

select 
    'Batting Outcomes' as analysisType,
    gameSimEvent as type,
    count(*) as count,
    round(cast(count(*) as float) / (select totalGameEvents from gameEvents) * 100, 2) as percentage
from gameSimEvents
where gameSimEvent in ('double', 'flyout', 'groundout', 'homerun', 'lineout', 'out', 'popout', 'single', 'strikeout', 'triple', 'walk')
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

union all

select
    'Pitch Types' as analysisType,
    pitchName as type,
    count(*) as count,
    round(cast(count(*) as float) / (select totalPitchEvents from pitchEvents) * 100, 2) as percentage
from gameSimEvents
where gameSimEvent = 'pitch' and pitchName is not null
group by pitchName

union all

select
    'Key Metrics' as analysisType,
    'Batting Average' as type,
    round(cast(sum(case when gameSimEvent in ('single', 'double', 'triple', 'homerun') then 1 else 0 end) as float) / 
        (select totalABs from atBats) * 1000, 0) as count,
    null as percentage
from gameSimEvents

union all

select
    'Key Metrics' as analysisType,
    'On Base Percentage' as type,
    round(cast(sum(case when gameSimEvent in ('single', 'double', 'triple', 'homerun', 'walk') then 1 else 0 end) as float) / 
        (select totalPAs from plateAppearances) * 1000, 0) as count,
    null as percentage
from gameSimEvents

union all

select
    'Key Metrics' as analysisType,
    'Pitches Per PA' as type,
    round(cast((select totalPitchEvents from pitchEvents) as float) / 
        (select totalPAs from plateAppearances), 2) as count,
    null as percentage
from gameSimEvents
group by 'Pitches Per PA'

union all

select
    'Batted Ball Types' as analysisType,
    case 
        when gameSimEvent = 'groundout' then 'Ground Ball'
        when gameSimEvent in ('flyout', 'popout') then 'Fly Ball'
        when gameSimEvent = 'lineout' then 'Line Drive'
    end as type,
    count(*) as count,
    round(cast(count(*) as float) / (select totalBattedBalls from battedBallEvents) * 100, 2) as percentage
from gameSimEvents
where gameSimEvent in ('flyout', 'groundout', 'lineout', 'popout')
group by case 
    when gameSimEvent = 'groundout' then 'Ground Ball'
    when gameSimEvent in ('flyout', 'popout') then 'Fly Ball'
    when gameSimEvent = 'lineout' then 'Line Drive'
end

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
