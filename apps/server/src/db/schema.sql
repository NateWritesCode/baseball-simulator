
		pragma foreign_keys = off;

		create table cities (
			idCity integer primary key autoincrement,
			idState integer not null,
			latitude real not null,
			longitude real not null,
			name text not null,
			foreign key (idState) references states(idState)
		);

		create table coaches (
			idCoach integer primary key autoincrement,
			idPerson integer not null,
			idTeam integer,
			foreign key (idPerson) references persons(idPerson)
			foreign key (idTeam) references teams(idTeam)
		);

		create table coachesRatings (
			ability integer not null,
			idCoach integer primary key,
			foreign key (idCoach) references coaches(idCoach)	
		);

		create table continents (
			abbreviation text not null unique,
			idContinent integer primary key autoincrement,
			name text not null unique
		);

		create table countries (
			abbreviation text not null unique,
			idContinent integer not null,
			idCountry integer primary key autoincrement,
			name text not null unique,
			foreign key (idContinent) references continents(idContinent)
		);

		create table divisions (
			abbreviation text not null,
			direction text check(direction in ('N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW')),
			idDivision integer primary key autoincrement,
			idLeague integer not null,
			idSubLeague integer not null,
			name text not null,
			foreign key (idLeague) references leagues(idLeague),
			foreign key (idSubLeague) references subLeagues(idSubLeague)
		);

		create table gameGroups (
			idGameGroup integer primary key autoincrement,
			idLeague integer not null,
			name text not null,
			standings text,
			foreign key (idLeague) references leagues(idLeague)
		);


		create table games (
			boxScore text,
			idGame integer primary key autoincrement,
			idGameGroup integer not null,
			idTeamAway integer not null,
			idTeamHome integer not null,
			dateTime text not null,
			
			foreign key (idGameGroup) references gameGroups(idGameGroup),
			foreign key (idTeamAway) references teams(idTeam),
			foreign key (idTeamHome) references teams(idTeam),

			unique (idTeamAway, idTeamHome, dateTime)
		);

		create table gameSimEvents (
				gameSimEvent text not null check(gameSimEvent in ('atBatStart', 'atBatEnd', 'balk', 'ball', 'catcherInterference', 'double', 'foul', 'gameStart', 'gameEnd', 'halfInningEnd', 'halfInningStart', 'hitByPitch', 'homeRun', 'out', 'pitch', 'run', 'single', 'stealAttempt', 'steal', 'stealCaught', 'strikeCalled', 'strikeSwinging', 'strikeout', 'triple', 'walk')),
				idGame integer not null,
				idGameSimEvent integer primary key autoincrement,
				idPlayerHitter integer,
				idPlayerPitcher integer,
				idPlayerRunner integer,
				idPlayerRunner1 integer,
				idPlayerRunner2 integer,
				idPlayerRunner3 integer,
				idTeamDefense integer,
				idTeamOffense integer,
				pitchLocation text,
				pitchName text check(pitchName in ('changeup', 'curveball', 'cutter', 'eephus', 'fastball', 'forkball', 'knuckleball', 'knuckleCurve', 'screwball', 'sinker', 'slider', 'slurve', 'splitter', 'sweeper')),
				pitchOutcome text check(pitchOutcome in ('ball', 'inPlay', 'strike'))
		);

		create table gameSimLogs (
			idGame integer primary key,
			gameSimLog text not null
		);

		create table leagues (
			abbreviation text not null unique,
			idLeague integer primary key autoincrement,
			name text not null unique
		);

		create table owners (
			idOwner integer primary key autoincrement,
			idPerson integer not null,
			idTeam integer not null,
			numTokens integer not null,
			foreign key (idPerson) references persons(idPerson)
			foreign key (idTeam) references teams(idTeam)
		);

		create table parks (
			backstopDistance integer not null,
			capacityMax integer not null,
			centerFieldDirection integer check(centerFieldDirection between 0 and 359) not null,
			idCity integer not null,
			idPark integer primary key autoincrement,
			idTeam integer,
			name text not null,
			roofType text check(roofType in ('dome', 'open', 'retractable')),
			surfaceType text check(surfaceType in ('artificial', 'grass')),
			foreign key (idCity) references cities(idCity),
			foreign key (idTeam) references teams(idTeam)
		);

		create table parksFieldCoordinates (
			basePath integer not null,
			batterLeftX integer not null,
			batterLeftY integer not null,
			batterRightX integer not null,
			batterRightY integer not null,
			coachesBoxFirstX integer not null,
			coachesBoxFirstY integer not null,
			coachesBoxThirdX integer not null,
			coachesBoxThirdY integer not null,
			firstBaseX integer not null,
			firstBaseY integer not null,
			foulLineLeftFieldX integer not null,
			foulLineLeftFieldY integer not null,
			foulLineRightFieldX integer not null,
			foulLineRightFieldY integer not null,
			homePlateX integer not null,
			homePlateY integer not null,
			idPark integer primary key,
			onDeckLeftX integer not null,
			onDeckLeftY integer not null,
			onDeckRightX integer not null,
			onDeckRightY integer not null,
			pitchersPlateX integer not null,
			pitchersPlateY integer not null,
			secondBaseX integer not null,
			secondBaseY integer not null,
			thirdBaseX integer not null,
			thirdBaseY integer not null,
			foreign key (idPark) references parks(idPark)
		);

		create table parksWallSegments (
			height integer not null,
			idPark integer not null,
			idWallSegment integer primary key autoincrement,
			segmentEndX integer not null,
			segmentEndY integer not null,
			segmentStartX integer not null,
			segmentStartY integer not null,
			foreign key (idPark) references parks(idPark)
		);


		create table persons (
			dateOfBirth text not null,
			firstName text not null,
			idCityOfBirth integer not null,
			idPerson integer primary key autoincrement,
			lastName text not null,
			middleName text,
			nickname text,
			foreign key (idCityOfBirth) references cities(idCity)
		);

		create table personsAlignment (
			chaotic integer not null,
			evil integer not null,
			good integer not null,
			idPerson integer primary key,
			lawful integer not null,
			neutralMorality integer not null,
			neutralOrder integer not null,
			foreign key (idPerson) references persons(idPerson)
		);

		create table personsMyersBriggs (
			extroversion integer not null,
			feeling integer not null,
			idPerson integer primary key,
			introversion integer not null,
			intuition integer not null,
			judging integer not null,
			perceiving integer not null,
			sensing integer not null,
			thinking integer not null,
			foreign key (idPerson) references persons(idPerson)
		);

		create table personsMental (
			charisma integer not null,
			constitution integer not null,
			idPerson integer primary key,
			intelligence integer not null,
			loyalty integer not null,
			wisdom integer not null,
			workEthic integer not null,
			foreign key (idPerson) references persons(idPerson)
		);

		create table personsPhysical (
			height integer not null,
			idPerson integer primary key,
			weight integer not null,
			foreign key (idPerson) references persons(idPerson)
		);

		create table players (
			bats text check(bats in ('r', 'l', 's')),
			idPlayer integer primary key,
			idPerson integer not null,
			idTeam integer,
			throws text check(throws in ('r', 'l', 's'))
		);

		create table playersBatting(
			avoidKs integer not null,
			avoidKsVL integer not null,
			avoidKsVR integer not null,
			contact integer not null,
			contactVL integer not null,
			contactVR integer not null,
			eye integer not null,
			eyeVL integer not null,
			eyeVR integer not null,
			gap integer not null,
			gapVL integer not null,
			gapVR integer not null,
			idPlayer integer primary key,
			power integer not null,
			powerVL integer not null,
			powerVR integer not null,
			foreign key (idPlayer) references players(idPlayer)
		);

		create table playersFielding(
			c integer not null,
			catcherAbility integer not null,
			catcherArm integer not null,
			catcherFraming integer not null,
			cf integer not null,
			fb integer not null,
			idPlayer integer primary key,
			infieldArm integer not null,
			infieldError integer not null,
			infieldRange integer not null,
			infieldDoublePlay integer not null,
			lf integer not null,
			outfieldArm integer not null,
			outfieldError integer not null,
			outfieldRange integer not null,
			rf integer not null,
			sb integer not null,
			ss integer not null,
			tb integer not null,
			foreign key (idPlayer) references players(idPlayer)
		);

		create table playersPitching(
			control integer not null,
			controlVL integer not null,
			controlVR integer not null,
			idPlayer integer primary key,
			movement integer not null,
			movementVL integer not null,
			movementVR integer not null,
			stamina integer not null,
			stuff integer not null,
			stuffVL integer not null,
			stuffVR integer not null,
			foreign key (idPlayer) references players(idPlayer)
		);

		create table playersPitches(
			changeup integer not null,
			curveball integer not null,
			cutter integer not null,
			eephus integer not null,
			fastball integer not null,
			forkball integer not null,
			idPlayer integer not null,
			knuckleball integer not null,
			knuckleCurve integer not null,
			screwball integer not null,
			sinker integer not null,
			slider integer not null,
			slurve integer not null,
			splitter integer not null,
			sweeper integer not null,
			foreign key (idPlayer) references players(idPlayer)
		);

		create table playersRunning(
			baserunning integer not null,
			idPlayer integer primary key,
			speed integer not null,
			stealing integer not null,
			foreign key (idPlayer) references players(idPlayer)            
		);

		create table states (
			abbreviation text not null,
			idCountry integer not null,
			idState integer primary key autoincrement,
			name text not null,
			foreign key (idCountry) references countries(idCountry)
		);

		create table statisticsPlayerGameGroupBatting (
			idPlayer integer not null,
			idGameGroup integer not null,
			idTeam integer not null,
			ab integer not null,
			doubles integer not null,
			h integer not null,
			hr integer not null,
			k integer not null,
			lob integer not null,
			outs integer not null,
			rbi integer not null,
			runs integer not null,
			sb integer not null,
			singles integer not null,
			triples integer not null,

			foreign key (idPlayer) references players(idPlayer)
			foreign key (idGameGroup) references gameGroups(idGameGroup)
			foreign key (idTeam) references teams(idTeam)

			primary key (idPlayer, idGameGroup, idTeam)
		);

		create table statisticsPlayerGameGroupFielding (
			idPlayer integer not null,
			idGameGroup integer not null,
			idTeam integer not null,
			errors integer not null,

			foreign key (idPlayer) references players(idPlayer)
			foreign key (idGameGroup) references gameGroups(idGameGroup)
			foreign key (idTeam) references teams(idTeam)

			primary key (idPlayer, idGameGroup, idTeam)
		);

		create table statisticsPlayerGameGroupPitching (
			idPlayer integer not null,
			idGameGroup integer not null,
			idTeam integer not null,
			balks integer not null,
			battersFaced integer not null,
			bb integer not null,
			doublesAllowed integer not null,
			k integer not null,
			pitchesThrown integer not null,
			pitchesThrownBalls integer not null,
			pitchesThrownInPlay integer not null,
			pitchesThrownStrikes integer not null,
			hitsAllowed integer not null,
			hrsAllowed integer not null,
			lob integer not null,
			outs integer not null,
			runs integer not null,
			runsEarned integer not null,
			singlesAllowed integer not null,
			triplesAllowed integer not null,

			foreign key (idPlayer) references players(idPlayer)
			foreign key (idGameGroup) references gameGroups(idGameGroup)
			foreign key (idTeam) references teams(idTeam)

			primary key (idPlayer, idGameGroup, idTeam)
		);

		create table subLeagues (
			abbreviation text not null,
			idLeague integer not null,
			idSubLeague integer primary key autoincrement,
			name text not null,
			foreign key (idLeague) references leagues(idLeague)
		);

		create table teamLineups (
			idTeam integer not null,
			lineupType text check(lineupType in ('r', 'l', 'rDh', 'lDh')),
			lineup text not null,

			foreign key (idTeam) references teams(idTeam)
		);

		create table teamPitchingStaffs (
			idTeam integer not null,
			pitchingStaff text not null,

			foreign key (idTeam) references teams(idTeam)
		);

		create table teams (
			abbreviation text not null,
			colorPrimary text not null,
			colorSecondary text not null,
			idCity integer not null,
			idDivision integer,
			idLeague integer not null,
			idTeam integer primary key autoincrement,
			idSubLeague integer not null,
			nickname text not null,
			foreign key (idCity) references cities(idCity),
			foreign key (idDivision) references divisions(idDivision),
			foreign key (idLeague) references leagues(idLeague),
			foreign key (idSubLeague) references subLeagues(idSubLeague)
		);


		create table umpires (
			idPerson integer,
			idUmpire integer primary key autoincrement,
			foreign key (idPerson) references persons(idPerson)
		);

		create table umpiresRatings (
			balkAccuracy integer not null,
			checkSwingAccuracy integer not null,
			consistency integer not null,
			expandedZone integer not null,
			favorFastballs integer not null,
			favorOffspeed integer not null,
			highZone integer not null,
			idUmpire integer primary key autoincrement,
			insideZone integer not null,
			lowZone integer not null,
			outsideZone integer not null,
			pitchFramingInfluence integer not null,
			reactionTime integer not null,
			foreign key (idUmpire) references umpires(idUmpire)
		);

		create table universe (
			dateTime text not null
		);

		pragma foreign_keys = on;
	