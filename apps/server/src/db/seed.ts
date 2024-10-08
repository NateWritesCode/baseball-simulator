import { faker } from "@faker-js/faker";
import { Database } from "bun:sqlite";
import dayjs from "dayjs";
import fs from "node:fs";

const DB_PATH = `${import.meta.dir}/baseball-simulator.db`;
const MIN_RATING = 1;
const MAX_RATING = 1_000;

try {
	if (fs.existsSync(DB_PATH)) {
		fs.unlinkSync(DB_PATH);
	} else {
		fs.writeFileSync(DB_PATH, "");
	}

	const db = new Database(DB_PATH, {
		safeIntegers: true,
		strict: true,
	});

	db.exec(/*sql*/ `
        pragma foreign_keys = off;

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

        create table states (
            abbreviation text not null,
            idCountry integer not null,
            idState integer primary key autoincrement,
            name text not null,
            foreign key (idCountry) references countries(idCountry)
        );

        create table cities (
            idCity integer primary key autoincrement,
            idState integer not null,
            latitude real not null,
            longitude real not null,
            name text not null,
            foreign key (idState) references states(idState)
        );

        create table persons (
            dateOfBirth date not null,
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
            idPlayer integer primary key,
            idPerson integer not null,
            idTeam integer
        );

        create table playersBatting(
            avoidKs integer not null,
            avoidKsVL integer not null,
            avoidKsVR integer not null,
            eye integer not null,
            eyeVL integer not null,
            eyeVR integer not null,
            contact integer not null,
            contactVL integer not null,
            contactVR integer not null,
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

        create table leagues (
            abbreviation text not null unique,
            idLeague integer primary key autoincrement,
            name text not null unique
        );

        create table subLeagues (
            abbreviation text not null,
            idLeague integer not null,
            idSubLeague integer primary key autoincrement,
            name text not null,
            foreign key (idLeague) references leagues(idLeague)
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

        create table games (
            idGame integer primary key autoincrement,
            idTeamAway integer not null,
            idTeamHome integer not null,
            dateTime date not null,
            foreign key (idTeamAway) references teams(idTeam),
            foreign key (idTeamHome) references teams(idTeam),

            unique (idTeamAway, idTeamHome, dateTime)
        );

		create table owners (
			idOwner integer primary key autoincrement,
			idPerson integer not null,
			idTeam integer not null,
			numTokens integer not null,
			foreign key (idPerson) references persons(idPerson)
			foreign key (idTeam) references teams(idTeam)
		);

        pragma foreign_keys = on;
    `);

	const seedContinents = [
		{ abbreviation: "AF", name: "Africa" },
		{ abbreviation: "AN", name: "Antarctica" },
		{ abbreviation: "AS", name: "Asia" },
		{ abbreviation: "EU", name: "Europe" },
		{ abbreviation: "NA", name: "North America" },
		{ abbreviation: "OC", name: "Oceania" },
		{ abbreviation: "SA", name: "South America" },
	];

	const insertContinent = db.prepare(/*sql*/ `
    insert into continents (abbreviation, name) values ($abbreviation, $name);
`);

	const insertContinents = db.transaction(() => {
		for (const seedContinent of seedContinents) {
			insertContinent.run(seedContinent);
		}
	});

	insertContinents(seedContinents);

	const seedCountries = [
		{
			abbreviation: 1,
			name: "United States of America",
			idContinent: 5,
		},
	];

	const insertCountry = db.prepare(/*sql*/ `
    insert into countries (abbreviation, name, idContinent) values ($abbreviation, $name, $idContinent);
`);

	const insertCountries = db.transaction(() => {
		for (const seedCountry of seedCountries) {
			insertCountry.run(seedCountry);
		}
	});

	insertCountries(seedCountries);

	const insertState = db.prepare(/*sql*/ `
    insert into states (abbreviation, name, idCountry) values ($abbreviation, $name, $idCountry);
`);

	const seedStates = [
		{ abbreviation: "AL", idCountry: 1, idState: 1, name: "Alabama" },
		{ abbreviation: "AK", idCountry: 1, idState: 2, name: "Alaska" },
		{ abbreviation: "AZ", idCountry: 1, idState: 3, name: "Arizona" },
		{ abbreviation: "AR", idCountry: 1, idState: 4, name: "Arkansas" },
		{ abbreviation: "CA", idCountry: 1, idState: 5, name: "California" },
		{ abbreviation: "CO", idCountry: 1, idState: 6, name: "Colorado" },
		{ abbreviation: "CT", idCountry: 1, idState: 7, name: "Connecticut" },
		{ abbreviation: "DE", idCountry: 1, idState: 8, name: "Delaware" },
		{ abbreviation: "FL", idCountry: 1, idState: 9, name: "Florida" },
		{ abbreviation: "GA", idCountry: 1, idState: 10, name: "Georgia" },
		{ abbreviation: "HI", idCountry: 1, idState: 11, name: "Hawaii" },
		{ abbreviation: "ID", idCountry: 1, idState: 12, name: "Idaho" },
		{ abbreviation: "IL", idCountry: 1, idState: 13, name: "Illinois" },
		{ abbreviation: "IN", idCountry: 1, idState: 14, name: "Indiana" },
		{ abbreviation: "IA", idCountry: 1, idState: 15, name: "Iowa" },
		{ abbreviation: "KS", idCountry: 1, idState: 16, name: "Kansas" },
		{ abbreviation: "KY", idCountry: 1, idState: 17, name: "Kentucky" },
		{ abbreviation: "LA", idCountry: 1, idState: 18, name: "Louisiana" },
		{ abbreviation: "ME", idCountry: 1, idState: 19, name: "Maine" },
		{ abbreviation: "MD", idCountry: 1, idState: 20, name: "Maryland" },
		{ abbreviation: "MA", idCountry: 1, idState: 21, name: "Massachusetts" },
		{ abbreviation: "MI", idCountry: 1, idState: 22, name: "Michigan" },
		{ abbreviation: "MN", idCountry: 1, idState: 23, name: "Minnesota" },
		{ abbreviation: "MS", idCountry: 1, idState: 24, name: "Mississippi" },
		{ abbreviation: "MO", idCountry: 1, idState: 25, name: "Missouri" },
		{ abbreviation: "MT", idCountry: 1, idState: 26, name: "Montana" },
		{ abbreviation: "NE", idCountry: 1, idState: 27, name: "Nebraska" },
		{ abbreviation: "NV", idCountry: 1, idState: 28, name: "Nevada" },
		{ abbreviation: "NH", idCountry: 1, idState: 29, name: "New Hampshire" },
		{ abbreviation: "NJ", idCountry: 1, idState: 30, name: "New Jersey" },
		{ abbreviation: "NM", idCountry: 1, idState: 31, name: "New Mexico" },
		{ abbreviation: "NY", idCountry: 1, idState: 32, name: "New York" },
		{ abbreviation: "NC", idCountry: 1, idState: 33, name: "North Carolina" },
		{ abbreviation: "ND", idCountry: 1, idState: 34, name: "North Dakota" },
		{ abbreviation: "OH", idCountry: 1, idState: 35, name: "Ohio" },
		{ abbreviation: "OK", idCountry: 1, idState: 36, name: "Oklahoma" },
		{ abbreviation: "OR", idCountry: 1, idState: 37, name: "Oregon" },
		{ abbreviation: "PA", idCountry: 1, idState: 38, name: "Pennsylvania" },
		{ abbreviation: "RI", idCountry: 1, idState: 39, name: "Rhode Island" },
		{ abbreviation: "SC", idCountry: 1, idState: 40, name: "South Carolina" },
		{ abbreviation: "SD", idCountry: 1, idState: 41, name: "South Dakota" },
		{ abbreviation: "TN", idCountry: 1, idState: 42, name: "Tennessee" },
		{ abbreviation: "TX", idCountry: 1, idState: 43, name: "Texas" },
		{ abbreviation: "UT", idCountry: 1, idState: 44, name: "Utah" },
		{ abbreviation: "VT", idCountry: 1, idState: 45, name: "Vermont" },
		{ abbreviation: "VA", idCountry: 1, idState: 46, name: "Virginia" },
		{ abbreviation: "WA", idCountry: 1, idState: 47, name: "Washington" },
		{ abbreviation: "WV", idCountry: 1, idState: 48, name: "West Virginia" },
		{ abbreviation: "WI", idCountry: 1, idState: 49, name: "Wisconsin" },
		{ abbreviation: "WY", idCountry: 1, idState: 50, name: "Wyoming" },
	];

	const insertStates = db.transaction(() => {
		for (const seedState of seedStates) {
			insertState.run(seedState);
		}
	});

	insertStates(seedStates);

	const insertCity = db.prepare(/*sql*/ `
        insert into cities (idState, latitude, longitude, name) values ($idState, $latitude, $longitude, $name);
    `);

	const getStateId = (abbreviation: string) => {
		const state = seedStates.find((s) => s.abbreviation === abbreviation);
		const idState = state?.idState;

		if (!idState) {
			throw new Error(`State with abbreviation ${abbreviation} not found`);
		}

		return idState;
	};

	const seedCities = [
		{
			name: "New York City",
			idState: getStateId("NY"),
			latitude: 40.7128,
			longitude: -74.006,
		},
		{
			name: "Los Angeles",
			idState: getStateId("CA"),
			latitude: 34.0522,
			longitude: -118.2437,
		},
		{
			name: "Chicago",
			idState: getStateId("IL"),
			latitude: 41.8781,
			longitude: -87.6298,
		},
		{
			name: "Houston",
			idState: getStateId("TX"),
			latitude: 29.7604,
			longitude: -95.3698,
		},
		{
			name: "Phoenix",
			idState: getStateId("AZ"),
			latitude: 33.4484,
			longitude: -112.074,
		},
		{
			name: "Philadelphia",
			idState: getStateId("PA"),
			latitude: 39.9526,
			longitude: -75.1652,
		},
		{
			name: "San Antonio",
			idState: getStateId("TX"),
			latitude: 29.4241,
			longitude: -98.4936,
		},
		{
			name: "San Diego",
			idState: getStateId("CA"),
			latitude: 32.7157,
			longitude: -117.1611,
		},
		{
			name: "Dallas",
			idState: getStateId("TX"),
			latitude: 32.7767,
			longitude: -96.797,
		},
		{
			name: "San Jose",
			idState: getStateId("CA"),
			latitude: 37.3382,
			longitude: -121.8863,
		},
		{
			name: "Austin",
			idState: getStateId("TX"),
			latitude: 30.2672,
			longitude: -97.7431,
		},
		{
			name: "Jacksonville",
			idState: getStateId("FL"),
			latitude: 30.3322,
			longitude: -81.6557,
		},
		{
			name: "Fort Worth",
			idState: getStateId("TX"),
			latitude: 32.7555,
			longitude: -97.3308,
		},
		{
			name: "Columbus",
			idState: getStateId("OH"),
			latitude: 39.9612,
			longitude: -82.9988,
		},
		{
			name: "San Francisco",
			idState: getStateId("CA"),
			latitude: 37.7749,
			longitude: -122.4194,
		},
		{
			name: "Charlotte",
			idState: getStateId("NC"),
			latitude: 35.2271,
			longitude: -80.8431,
		},
		{
			name: "Indianapolis",
			idState: getStateId("IN"),
			latitude: 39.7684,
			longitude: -86.1581,
		},
		{
			name: "Seattle",
			idState: getStateId("WA"),
			latitude: 47.6062,
			longitude: -122.3321,
		},
		{
			name: "Denver",
			idState: getStateId("CO"),
			latitude: 39.7392,
			longitude: -104.9903,
		},
		{
			name: "Boston",
			idState: getStateId("MA"),
			latitude: 42.3601,
			longitude: -71.0589,
		},
		{
			name: "El Paso",
			idState: getStateId("TX"),
			latitude: 31.7619,
			longitude: -106.485,
		},
		{
			name: "Detroit",
			idState: getStateId("MI"),
			latitude: 42.3314,
			longitude: -83.0458,
		},
		{
			name: "Nashville",
			idState: getStateId("TN"),
			latitude: 36.1627,
			longitude: -86.7816,
		},
		{
			name: "Portland",
			idState: getStateId("OR"),
			latitude: 45.5155,
			longitude: -122.6789,
		},
		{
			name: "Memphis",
			idState: getStateId("TN"),
			latitude: 35.1495,
			longitude: -90.049,
		},
		{
			name: "Oklahoma City",
			idState: getStateId("OK"),
			latitude: 35.4676,
			longitude: -97.5164,
		},
		{
			name: "Las Vegas",
			idState: getStateId("NV"),
			latitude: 36.1699,
			longitude: -115.1398,
		},
		{
			name: "Louisville",
			idState: getStateId("KY"),
			latitude: 38.2527,
			longitude: -85.7585,
		},
		{
			name: "Baltimore",
			idState: getStateId("MD"),
			latitude: 39.2904,
			longitude: -76.6122,
		},
		{
			name: "Milwaukee",
			idState: getStateId("WI"),
			latitude: 43.0389,
			longitude: -87.9065,
		},
		{
			name: "Albuquerque",
			idState: getStateId("NM"),
			latitude: 35.0844,
			longitude: -106.6504,
		},
		{
			name: "Tucson",
			idState: getStateId("AZ"),
			latitude: 32.2226,
			longitude: -110.9747,
		},
		{
			name: "Fresno",
			idState: getStateId("CA"),
			latitude: 36.7378,
			longitude: -119.7871,
		},
		{
			name: "Mesa",
			idState: getStateId("AZ"),
			latitude: 33.4152,
			longitude: -111.8315,
		},
		{
			name: "Sacramento",
			idState: getStateId("CA"),
			latitude: 38.5816,
			longitude: -121.4944,
		},
		{
			name: "Atlanta",
			idState: getStateId("GA"),
			latitude: 33.749,
			longitude: -84.388,
		},
		{
			name: "Kansas City",
			idState: getStateId("MO"),
			latitude: 39.0997,
			longitude: -94.5786,
		},
		{
			name: "Colorado Springs",
			idState: getStateId("CO"),
			latitude: 38.8339,
			longitude: -104.8214,
		},
		{
			name: "Miami",
			idState: getStateId("FL"),
			latitude: 25.7617,
			longitude: -80.1918,
		},
		{
			name: "Raleigh",
			idState: getStateId("NC"),
			latitude: 35.7796,
			longitude: -78.6382,
		},
		{
			name: "Omaha",
			idState: getStateId("NE"),
			latitude: 41.2565,
			longitude: -95.9345,
		},
		{
			name: "Long Beach",
			idState: getStateId("CA"),
			latitude: 33.7701,
			longitude: -118.1937,
		},
		{
			name: "Virginia Beach",
			idState: getStateId("VA"),
			latitude: 36.8529,
			longitude: -75.978,
		},
		{
			name: "Oakland",
			idState: getStateId("CA"),
			latitude: 37.8044,
			longitude: -122.2711,
		},
		{
			name: "Minneapolis",
			idState: getStateId("MN"),
			latitude: 44.9778,
			longitude: -93.265,
		},
		{
			name: "Tulsa",
			idState: getStateId("OK"),
			latitude: 36.154,
			longitude: -95.9928,
		},
		{
			name: "Arlington",
			idState: getStateId("TX"),
			latitude: 32.7357,
			longitude: -97.1081,
		},
		{
			name: "Tampa",
			idState: getStateId("FL"),
			latitude: 27.9506,
			longitude: -82.4572,
		},
		{
			name: "New Orleans",
			idState: getStateId("LA"),
			latitude: 29.9511,
			longitude: -90.0715,
		},
		{
			name: "Wichita",
			idState: getStateId("KS"),
			latitude: 37.6872,
			longitude: -97.3301,
		},
		{
			name: "Cleveland",
			idState: getStateId("OH"),
			latitude: 41.4993,
			longitude: -81.6944,
		},
		{
			name: "Bakersfield",
			idState: getStateId("CA"),
			latitude: 35.3733,
			longitude: -119.0187,
		},
		{
			name: "Aurora",
			idState: getStateId("CO"),
			latitude: 39.7294,
			longitude: -104.8319,
		},
		{
			name: "Anaheim",
			idState: getStateId("CA"),
			latitude: 33.8366,
			longitude: -117.9143,
		},
		{
			name: "Honolulu",
			idState: getStateId("HI"),
			latitude: 21.3069,
			longitude: -157.8583,
		},
		{
			name: "Santa Ana",
			idState: getStateId("CA"),
			latitude: 33.7455,
			longitude: -117.8677,
		},
		{
			name: "Riverside",
			idState: getStateId("CA"),
			latitude: 33.9534,
			longitude: -117.3962,
		},
		{
			name: "Corpus Christi",
			idState: getStateId("TX"),
			latitude: 27.8006,
			longitude: -97.3964,
		},
		{
			name: "Lexington",
			idState: getStateId("KY"),
			latitude: 38.0406,
			longitude: -84.5037,
		},
		{
			name: "Stockton",
			idState: getStateId("CA"),
			latitude: 37.9577,
			longitude: -121.2908,
		},
		{
			name: "Henderson",
			idState: getStateId("NV"),
			latitude: 36.0395,
			longitude: -114.9817,
		},
		{
			name: "Saint Paul",
			idState: getStateId("MN"),
			latitude: 44.9537,
			longitude: -93.09,
		},
		{
			name: "St. Louis",
			idState: getStateId("MO"),
			latitude: 38.627,
			longitude: -90.1994,
		},
		{
			name: "Cincinnati",
			idState: getStateId("OH"),
			latitude: 39.1031,
			longitude: -84.512,
		},
		{
			name: "Pittsburgh",
			idState: getStateId("PA"),
			latitude: 40.4406,
			longitude: -79.9959,
		},
		{
			name: "Greensboro",
			idState: getStateId("NC"),
			latitude: 36.0726,
			longitude: -79.792,
		},
		{
			name: "Anchorage",
			idState: getStateId("AK"),
			latitude: 61.2181,
			longitude: -149.9003,
		},
		{
			name: "Plano",
			idState: getStateId("TX"),
			latitude: 33.0198,
			longitude: -96.6989,
		},
		{
			name: "Lincoln",
			idState: getStateId("NE"),
			latitude: 40.8136,
			longitude: -96.7026,
		},
		{
			name: "Orlando",
			idState: getStateId("FL"),
			latitude: 28.5383,
			longitude: -81.3792,
		},
		{
			name: "Irvine",
			idState: getStateId("CA"),
			latitude: 33.6846,
			longitude: -117.8265,
		},
		{
			name: "Newark",
			idState: getStateId("NJ"),
			latitude: 40.7357,
			longitude: -74.1724,
		},
		{
			name: "Toledo",
			idState: getStateId("OH"),
			latitude: 41.6528,
			longitude: -83.5379,
		},
		{
			name: "Durham",
			idState: getStateId("NC"),
			latitude: 35.994,
			longitude: -78.8986,
		},
		{
			name: "Chula Vista",
			idState: getStateId("CA"),
			latitude: 32.6401,
			longitude: -117.0842,
		},
		{
			name: "Fort Wayne",
			idState: getStateId("IN"),
			latitude: 41.0793,
			longitude: -85.1394,
		},
		{
			name: "Jersey City",
			idState: getStateId("NJ"),
			latitude: 40.7178,
			longitude: -74.0431,
		},
		{
			name: "St. Petersburg",
			idState: getStateId("FL"),
			latitude: 27.7676,
			longitude: -82.6403,
		},
		{
			name: "Laredo",
			idState: getStateId("TX"),
			latitude: 27.506,
			longitude: -99.507,
		},
		{
			name: "Madison",
			idState: getStateId("WI"),
			latitude: 43.0731,
			longitude: -89.4012,
		},
		{
			name: "Chandler",
			idState: getStateId("AZ"),
			latitude: 33.3062,
			longitude: -111.8413,
		},
		{
			name: "Buffalo",
			idState: getStateId("NY"),
			latitude: 42.8864,
			longitude: -78.8784,
		},
		{
			name: "Lubbock",
			idState: getStateId("TX"),
			latitude: 33.5779,
			longitude: -101.8552,
		},
		{
			name: "Scottsdale",
			idState: getStateId("AZ"),
			latitude: 33.4942,
			longitude: -111.9261,
		},
		{
			name: "Reno",
			idState: getStateId("NV"),
			latitude: 39.5296,
			longitude: -119.8138,
		},
		{
			name: "Glendale",
			idState: getStateId("AZ"),
			latitude: 33.5387,
			longitude: -112.186,
		},
		{
			name: "Gilbert",
			idState: getStateId("AZ"),
			latitude: 33.3528,
			longitude: -111.789,
		},
		{
			name: "Winston-Salem",
			idState: getStateId("NC"),
			latitude: 36.0999,
			longitude: -80.2442,
		},
		{
			name: "North Las Vegas",
			idState: getStateId("NV"),
			latitude: 36.1989,
			longitude: -115.1175,
		},
		{
			name: "Norfolk",
			idState: getStateId("VA"),
			latitude: 36.8508,
			longitude: -76.2859,
		},
		{
			name: "Chesapeake",
			idState: getStateId("VA"),
			latitude: 36.7682,
			longitude: -76.2875,
		},
		{
			name: "Garland",
			idState: getStateId("TX"),
			latitude: 32.9126,
			longitude: -96.6389,
		},
		{
			name: "Irving",
			idState: getStateId("TX"),
			latitude: 32.814,
			longitude: -96.9489,
		},
		{
			name: "Hialeah",
			idState: getStateId("FL"),
			latitude: 25.8576,
			longitude: -80.2781,
		},
		{
			name: "Fremont",
			idState: getStateId("CA"),
			latitude: 37.5485,
			longitude: -121.9886,
		},
		{
			name: "Boise",
			idState: getStateId("ID"),
			latitude: 43.615,
			longitude: -116.2023,
		},
		{
			name: "Richmond",
			idState: getStateId("VA"),
			latitude: 37.5407,
			longitude: -77.436,
		},
		{
			name: "Baton Rouge",
			idState: getStateId("LA"),
			latitude: 30.4515,
			longitude: -91.1871,
		},
	].map((city, i) => {
		return {
			...city,
			idCity: i + 1,
		};
	});

	const insertCities = db.transaction(() => {
		for (const seedCity of seedCities) {
			insertCity.run(seedCity);
		}
	});

	insertCities(seedCities);

	const seedLeagues = [
		{
			abbreviation: "MLB",
			name: "Major League Baseball",
		},
	];

	const insertLeague = db.prepare(/*sql*/ `
     insert into leagues (abbreviation, name) values ($abbreviation, $name);
    `);

	const insertLeagues = db.transaction(() => {
		for (const seedLeague of seedLeagues) {
			insertLeague.run(seedLeague);
		}
	});

	insertLeagues(seedLeagues);

	const seedSubLeagues = [
		{
			idLeague: 1,
			idSubLeague: 1,
			abbreviation: "AL",
			name: "American League",
		},
		{
			idLeague: 1,
			idSubLeague: 2,
			abbreviation: "NL",
			name: "National League",
		},
	];

	const insertSubLeague = db.prepare(/*sql*/ `
        insert into subLeagues (idLeague, abbreviation, name) values ($idLeague, $abbreviation, $name);
    `);

	const insertSubLeagues = db.transaction(() => {
		for (const seedSubLeague of seedSubLeagues) {
			insertSubLeague.run(seedSubLeague);
		}
	});

	insertSubLeagues(seedSubLeagues);

	const seedDivisions = [
		{
			idDivision: 1,
			idLeague: 1,
			idSubLeague: 1,
			abbreviation: "E",
			direction: "E",
			name: "East",
		},
		{
			idDivision: 2,
			idLeague: 1,
			idSubLeague: 1,
			abbreviation: "C",
			direction: null,
			name: "Central",
		},
		{
			idDivision: 3,
			idLeague: 1,
			idSubLeague: 1,
			abbreviation: "W",
			direction: "W",
			name: "West",
		},
		{
			idDivision: 4,
			idLeague: 1,
			idSubLeague: 2,
			abbreviation: "E",
			direction: "E",
			name: "East",
		},
		{
			idDivision: 5,
			idLeague: 1,
			idSubLeague: 2,
			abbreviation: "C",
			direction: null,
			name: "Central",
		},
		{
			idDivision: 6,
			idLeague: 1,
			idSubLeague: 2,
			abbreviation: "W",
			direction: "W",
			name: "West",
		},
	];

	const insertDivision = db.prepare(/*sql*/ `
          insert into divisions (idDivision, idLeague, idSubLeague, abbreviation, direction, name) values ($idDivision, $idLeague, $idSubLeague, $abbreviation, $direction, $name);
     `);

	const insertDivisions = db.transaction(() => {
		for (const seedDivision of seedDivisions) {
			insertDivision.run(seedDivision);
		}
	});

	insertDivisions(seedDivisions);

	const seedTeamsCities = Array.from({ length: 30 }, (_) => {
		return faker.helpers.arrayElement(seedCities);
	}).map((city, i) => {
		return {
			...city,
			idSubLeague: i % 2 === 0 ? 1 : 2,
		};
	});

	const seedTeamsCitiesBySubLeague = seedTeamsCities.reduce(
		(result: { [key: string]: typeof seedTeamsCities }, currentItem) => {
			if (!result[currentItem.idSubLeague]) {
				result[currentItem.idSubLeague] = [];
			}
			result[currentItem.idSubLeague].push(currentItem);
			return result;
		},
		{} as { [key: string]: typeof seedTeamsCities },
	);

	function getDivisionValue(
		city: (typeof seedCities)[0],
		divisions: typeof seedDivisions,
	): number {
		const hasNorth = divisions.some((d) => d.direction?.includes("N"));
		const hasSouth = divisions.some((d) => d.direction?.includes("S"));
		const hasEast = divisions.some((d) => d.direction?.includes("E"));
		const hasWest = divisions.some((d) => d.direction?.includes("W"));

		const centerLat =
			hasNorth && hasSouth ? 0 : hasNorth ? 90 : hasSouth ? -90 : 0;
		const centerLon =
			hasEast && hasWest ? 0 : hasEast ? 180 : hasWest ? -180 : 0;

		const latValue = Math.abs(city.latitude - centerLat);
		const lonValue = Math.abs(city.longitude - centerLon);

		return latValue + lonValue;
	}

	function assignCitiesToDivisions(
		cities: typeof seedTeamsCities,
		divisions: typeof seedDivisions,
	) {
		const teamsPerDivision = Math.floor(cities.length / divisions.length);
		let extraTeams = cities.length % divisions.length;

		const sortedCities = [...cities].sort((a, b) => {
			const aValue = getDivisionValue(a, divisions);
			const bValue = getDivisionValue(b, divisions);
			return aValue - bValue;
		});

		const result = [];

		let currentIndex = 0;
		for (const division of divisions) {
			const divisionSize = teamsPerDivision + (extraTeams > 0 ? 1 : 0);
			for (
				let i = 0;
				i < divisionSize && currentIndex < sortedCities.length;
				i++
			) {
				result.push({
					...sortedCities[currentIndex],
					idDivision: division.idDivision,
				});
				currentIndex++;
			}
			if (extraTeams > 0) extraTeams--;
		}

		return result;
	}

	const seedTeamsCitiesSubLeagues = Object.keys(seedTeamsCitiesBySubLeague).map(
		(idSubLeague) => {
			const cities = seedTeamsCitiesBySubLeague[idSubLeague];
			const divisions = seedDivisions.filter(
				(division) => division.idSubLeague === Number(idSubLeague),
			);

			const citiesWithDivision = assignCitiesToDivisions(cities, divisions);

			return citiesWithDivision.map((city) => {
				const mascot = faker.word.noun();
				const nickname =
					`${mascot}s`.charAt(0).toUpperCase() + `${mascot}s`.slice(1);
				const abbreviation = `${city.name.slice(0, 3).toUpperCase()}${nickname.slice(0, 3).toUpperCase()}`;

				return {
					abbreviation,
					colorPrimary: faker.internet.color().toUpperCase(),
					colorSecondary: faker.internet.color().toUpperCase(),
					nickname,
					...city,
				};
			});
		},
	);

	const seedTeams = Object.values(seedTeamsCitiesSubLeagues)
		.flat()
		.map((team, i) => {
			return {
				...team,
				idLeague: 1,
				idTeam: i + 1,
			};
		});

	const insertTeam = db.prepare(/*sql*/ `
          insert into teams (abbreviation, colorPrimary, colorSecondary, nickname, idCity, idDivision, idLeague, idSubLeague, idTeam) values ($abbreviation, $colorPrimary, $colorSecondary, $nickname, $idCity, $idDivision, $idLeague, $idSubLeague, $idTeam);
     `);

	const insertTeams = db.transaction(() => {
		for (const seedTeam of seedTeams) {
			insertTeam.run({
				abbreviation: seedTeam.abbreviation,
				colorPrimary: seedTeam.colorPrimary,
				colorSecondary: seedTeam.colorSecondary,
				nickname: seedTeam.nickname,
				idCity: seedTeam.idCity,
				idDivision: seedTeam.idDivision,
				idLeague: seedTeam.idLeague,
				idSubLeague: seedTeam.idSubLeague,
				idTeam: seedTeam.idTeam,
			});
		}
	});

	insertTeams(seedTeams);

	const createGames = ({
		dateStart,
		dateEnd,
		isInterleagueAllowed,
		numGamesPerTeam,
		numTypicalSeriesLength,
		teams,
	}: {
		dateStart: string;
		dateEnd: string;
		isInterleagueAllowed: boolean;
		numGamesPerTeam: number;
		numTypicalSeriesLength: number;
		teams: {
			idLeague: number;
			idTeam: number;
			idDivision: number;
			idSubLeague: number;
			idCity: number;
			name: string;
			idState: number;
			latitude: number;
			longitude: number;
			abbreviation: string;
			colorPrimary: string;
			colorSecondary: string;
			nickname: string;
		}[];
	}): {
		idTeamAway: number;
		idTeamHome: number;
		dateTime: string;
	}[] => {
		const numDaysBetweenStartAndEnd = dayjs(dateEnd).diff(dateStart, "day");

		if (numDaysBetweenStartAndEnd < numGamesPerTeam) {
			throw new Error("Not enough days between start and end dates");
		}

		const numTotalGames = (teams.length * numGamesPerTeam) / 2;

		const games: {
			idTeamAway: number;
			idTeamHome: number;
			dateTime: string;
		}[] = [];

		const startDate = dayjs(dateStart);
		const endDate = dayjs(dateEnd);
		const totalDays = endDate.diff(startDate, "day") + 1;

		const gameDates: string[] = [];
		for (let i = 0; i < totalDays; i++) {
			gameDates.push(startDate.add(i, "day").format());
		}

		const teamGamesPlayed = new Map(teams.map((team) => [team.idTeam, 0]));
		const teamGameDates = new Map(
			teams.map((team) => [team.idTeam, new Set<string>()]),
		);

		const updateTeamGames = (teamId: number, date: string) => {
			const _teamGamesPlayed = teamGamesPlayed.get(teamId);
			const _teamGameDates = teamGameDates.get(teamId);
			if (_teamGamesPlayed === undefined) {
				throw new Error(`Team games played with id ${teamId} not found`);
			}

			if (_teamGameDates === undefined) {
				throw new Error(`Team game dates with id ${teamId} not found`);
			}

			teamGamesPlayed.set(teamId, _teamGamesPlayed + 1);
			_teamGameDates.add(date);
		};

		const getTeamsNeedingGames = () => {
			return Array.from(teamGamesPlayed.entries())
				.filter(([, gamesPlayed]) => gamesPlayed < numGamesPerTeam)
				.sort(([, a], [, b]) => a - b)
				.map(([teamId]) => teamId);
		};

		const isTeamAvailable = (teamId: number, date: string) => {
			const _teamGameDates = teamGameDates.get(teamId);

			if (_teamGameDates === undefined) {
				throw new Error(`Team game dates with id ${teamId} not found`);
			}

			return !_teamGameDates.has(date);
		};

		const scheduleSeries = (
			teamA: number,
			teamB: number,
			startDateIndex: number,
		) => {
			const seriesLength = Math.min(
				numTypicalSeriesLength,
				numGamesPerTeam - (teamGamesPlayed.get(teamA) || 0),
				numGamesPerTeam - (teamGamesPlayed.get(teamB) || 0),
			);

			for (let i = 0; i < seriesLength; i++) {
				const gameDate = gameDates[startDateIndex + i];
				if (
					!gameDate ||
					!isTeamAvailable(teamA, gameDate) ||
					!isTeamAvailable(teamB, gameDate)
				) {
					break;
				}

				games.push({
					idTeamAway: teamA,
					idTeamHome: teamB,
					dateTime: gameDate,
				});
				updateTeamGames(teamA, gameDate);
				updateTeamGames(teamB, gameDate);

				if (games.length >= numTotalGames) return true;
			}
			return false;
		};

		for (let dateIndex = 0; dateIndex < gameDates.length; dateIndex++) {
			const teamsNeedingGames = getTeamsNeedingGames().filter((teamId) =>
				isTeamAvailable(teamId, gameDates[dateIndex]),
			);

			for (let i = 0; i < teamsNeedingGames.length - 1; i += 2) {
				const teamA = teamsNeedingGames[i];
				const teamB = teamsNeedingGames[i + 1];

				const _teamA = teams.find((t) => t.idTeam === teamA);
				const _teamB = teams.find((t) => t.idTeam === teamB);

				if (!_teamA || !_teamB) {
					throw new Error(`Team with id ${teamA} or ${teamB} not found`);
				}

				if (isInterleagueAllowed || _teamA.idLeague === _teamB.idLeague) {
					const seriesCompleted = scheduleSeries(teamA, teamB, dateIndex);
					if (seriesCompleted) return games;
				}
			}
		}

		return games;
	};

	const seedGames = createGames({
		dateStart: "2024-04-01",
		dateEnd: "2024-10-01",
		isInterleagueAllowed: true,
		numGamesPerTeam: 162,
		numTypicalSeriesLength: 3,
		teams: seedTeams,
	});

	const insertGame = db.prepare(/*sql*/ `
                insert into games (idTeamAway, idTeamHome, dateTime) values ($idTeamAway, $idTeamHome, $dateTime);
         `);

	const insertGames = db.transaction(() => {
		for (const seedGame of seedGames) {
			insertGame.run(seedGame);
		}
	});

	insertGames(seedGames);

	const getAlignmentNums = () => {
		// https://math.stackexchange.com/questions/1276206/method-of-generating-random-numbers-that-sum-to-100-is-this-truly-random

		const num1 = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const num2 = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const num3 = faker.number.int({ min: MIN_RATING, max: MAX_RATING });

		const numArray = [num1, num2, num3].sort((a, b) => a - b);

		const trait1 = numArray[1] - numArray[0];
		const trait2 = numArray[2] - numArray[1];
		const trait3 = MAX_RATING + numArray[0] - numArray[2];

		return [trait1, trait2, trait3];
	};

	const getRandom0or1 = (weight?: number) => {
		// Weight goes to likelihood of returning 0, so 0.3 means 30% chance of returning 0
		// If weight is not provided, it defaults to 0.5, which means 50% chance of returning 0
		if (weight && (weight <= 0 || weight >= 1)) {
			throw new Error("Weight must be between 0 and 1");
		}

		return Math.random() < (weight || 0.5) ? 0 : 1;
	};

	const getRandomBoxMullerTransform = ({
		min,
		max,
		skew,
	}: { min: number; max: number; skew: number }) => {
		// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
		let u = 0;
		let v = 0;
		while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
		while (v === 0) v = Math.random();
		let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

		num = num / 10.0 + 0.5; // Translate to 0 -> 1
		if (num > 1 || num < 0)
			num = getRandomBoxMullerTransform({ min, max, skew });
		// resample between 0 and 1 if out of range
		else {
			num = num ** skew; // Skew
			num *= max - min; // Stretch to fill range
			num += min; // offset to min
		}

		return Math.round(num);
	};

	const getMyersBriggsValue = (weight: number) => {
		const isFirstTrait = getRandom0or1(weight);
		const firstTrait = isFirstTrait
			? getRandomBoxMullerTransform({
					min: MAX_RATING / 2,
					max: MAX_RATING,
					skew: 1,
				})
			: getRandomBoxMullerTransform({
					min: MIN_RATING,
					max: MAX_RATING / 2,
					skew: 1,
				});
		const secondTrait = MAX_RATING - firstTrait;

		return [firstTrait, secondTrait];
	};

	const getMyersBriggs = () => {
		const gender = "m";

		const [extroversion, introversion] = getMyersBriggsValue(
			gender === "m" ? 0.459 : 0.526,
		);

		const [sensing, intuition] = getMyersBriggsValue(
			gender === "m" ? 0.719 : 0.749,
		);

		const [thinking, feeling] = getMyersBriggsValue(
			gender === "m" ? 0.719 : 0.749,
		);

		const [judging, perceiving] = getMyersBriggsValue(
			gender === "m" ? 0.52 : 0.562,
		);

		return {
			extroversion,
			feeling,
			intuition,
			introversion,
			judging,
			perceiving,
			sensing,
			thinking,
		};
	};

	const seedPersons = Array.from({ length: 780 }, (_, i) => {
		const [chaotic, neutralOrder, lawful] = getAlignmentNums();
		const [good, neutralMorality, evil] = getAlignmentNums();
		const alignment = {
			chaotic,
			evil,
			good,
			lawful,
			neutralMorality,
			neutralOrder,
		};

		const myersBriggs = getMyersBriggs();

		const cityOfBirth = faker.helpers.arrayElement(seedCities);
		return {
			alignment,
			dateOfBirth: faker.date
				.between({ from: "1984-01-01", to: "2004-12-31" })
				.toISOString()
				.split("T")[0],
			firstName: faker.person.firstName("male"),
			idCityOfBirth: cityOfBirth.idCity,
			idPerson: i + 1,
			lastName: faker.person.lastName("male"),
			mental: {
				charisma: faker.number.int({ min: MIN_RATING, max: MAX_RATING }),
				constitution: faker.number.int({
					min: MIN_RATING,
					max: MAX_RATING,
				}),
				intelligence: faker.number.int({
					min: MIN_RATING,
					max: MAX_RATING,
				}),
				loyalty: faker.number.int({ min: MIN_RATING, max: MAX_RATING }),
				wisdom: faker.number.int({ min: MIN_RATING, max: MAX_RATING }),
				workEthic: faker.number.int({ min: MIN_RATING, max: MAX_RATING }),
			},
			middleName: faker.person.middleName("male"),
			myersBriggs,
			nickname: null,
			physical: {
				height: faker.number.int({
					min: MIN_RATING + 500,
					max: MAX_RATING - 300,
				}),
				weight: faker.number.int({
					min: MIN_RATING + 500,
					max: MAX_RATING - 300,
				}),
			},
		};
	});

	const insertPerson = db.prepare(/*sql*/ `
           insert into persons (dateOfBirth, firstName, idCityOfBirth, idPerson, lastName, middleName, nickname)
           values ($dateOfBirth, $firstName, $idCityOfBirth, $idPerson, $lastName, $middleName, $nickname);
       `);

	const insertPersons = db.transaction(() => {
		for (const seedPerson of seedPersons) {
			insertPerson.run({
				dateOfBirth: seedPerson.dateOfBirth,
				firstName: seedPerson.firstName,
				idCityOfBirth: seedPerson.idCityOfBirth,
				idPerson: seedPerson.idPerson,
				lastName: seedPerson.lastName,
				middleName: seedPerson.middleName,
				nickname: seedPerson.nickname,
			});
		}
	});

	insertPersons(seedPersons);

	const insertPersonAlignment = db.prepare(/*sql*/ `
             insert into personsAlignment (idPerson, chaotic, evil, good, lawful, neutralMorality, neutralOrder)
             values ($idPerson, $chaotic, $evil, $good, $lawful, $neutralMorality, $neutralOrder);
          `);

	const insertPersonsAlignment = db.transaction(() => {
		for (const seedPerson of seedPersons) {
			insertPersonAlignment.run({
				idPerson: seedPerson.idPerson,
				chaotic: seedPerson.alignment.chaotic,
				evil: seedPerson.alignment.evil,
				good: seedPerson.alignment.good,
				lawful: seedPerson.alignment.lawful,
				neutralMorality: seedPerson.alignment.neutralMorality,
				neutralOrder: seedPerson.alignment.neutralOrder,
			});
		}
	});

	insertPersonsAlignment(seedPersons);

	const insertPersonMental = db.prepare(/*sql*/ `
             insert into personsMental (idPerson, charisma, constitution, intelligence, loyalty, wisdom, workEthic)
             values ($idPerson, $charisma, $constitution, $intelligence, $loyalty, $wisdom, $workEthic);
          `);

	const insertPersonsMental = db.transaction(() => {
		for (const seedPerson of seedPersons) {
			insertPersonMental.run({
				idPerson: seedPerson.idPerson,
				charisma: seedPerson.mental.charisma,
				constitution: seedPerson.mental.constitution,
				intelligence: seedPerson.mental.intelligence,
				loyalty: seedPerson.mental.loyalty,
				wisdom: seedPerson.mental.wisdom,
				workEthic: seedPerson.mental.workEthic,
			});
		}
	});

	insertPersonsMental(seedPersons);

	const insertPersonMyersBriggs = db.prepare(/*sql*/ `
             insert into personsMyersBriggs (idPerson, extroversion, feeling, intuition, introversion, judging, perceiving, sensing, thinking)
             values ($idPerson, $extroversion, $feeling, $intuition, $introversion, $judging, $perceiving, $sensing, $thinking);
          `);

	const insertPersonsMyersBriggs = db.transaction(() => {
		for (const seedPerson of seedPersons) {
			insertPersonMyersBriggs.run({
				idPerson: seedPerson.idPerson,
				extroversion: seedPerson.myersBriggs.extroversion,
				feeling: seedPerson.myersBriggs.feeling,
				intuition: seedPerson.myersBriggs.intuition,
				introversion: seedPerson.myersBriggs.introversion,
				judging: seedPerson.myersBriggs.judging,
				perceiving: seedPerson.myersBriggs.perceiving,
				sensing: seedPerson.myersBriggs.sensing,
				thinking: seedPerson.myersBriggs.thinking,
			});
		}
	});

	insertPersonsMyersBriggs(seedPersons);

	const insertPersonPhysical = db.prepare(/*sql*/ `
             insert into personsPhysical (idPerson, height, weight)
             values ($idPerson, $height, $weight);
          `);

	const insertPersonsPhysical = db.transaction(() => {
		for (const seedPerson of seedPersons) {
			insertPersonPhysical.run({
				idPerson: seedPerson.idPerson,
				height: seedPerson.physical.height,
				weight: seedPerson.physical.weight,
			});
		}
	});

	insertPersonsPhysical(seedPersons);

	const seedPersonsOwners = seedPersons.slice(0, 30);
	const seedPersonsPlayers = seedPersons.slice(30);

	const insertOwner = db.prepare(/*sql*/ `
			 insert into owners (idPerson, idTeam, numTokens) values ($idPerson, $idTeam, $numTokens);
		  `);

	const insertOwners = db.transaction(() => {
		let idTeamIndex = 1;
		for (const seedPerson of seedPersonsOwners) {
			insertOwner.run({
				idPerson: seedPerson.idPerson,
				idTeam: idTeamIndex,
				numTokens: 1_000,
			});
			idTeamIndex++;
		}
	});

	insertOwners(seedPersonsOwners);

	let idTeamIndex = 1;

	const seedPlayers = seedPersonsPlayers.map((person, i) => {
		// Batting
		const avoidKs = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const contact = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const eye = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const gap = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const power = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const batting = {
			avoidKs,
			avoidKsVL: avoidKs,
			avoidKsVR: avoidKs,
			contact,
			contactVL: contact,
			contactVR: contact,
			eye,
			eyeVL: eye,
			eyeVR: eye,
			gap,
			gapVL: gap,
			gapVR: gap,
			power,
			powerVL: power,
			powerVR: power,
		};

		// Fielding
		const c = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const catcherAbility = c;
		const catcherArm = c;
		const catcherFraming = c;
		const cf = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const fb = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const infieldArm = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const infieldDoublePlay = infieldArm;
		const infieldError = infieldArm;
		const infieldRange = infieldArm;
		const lf = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const outfieldArm = faker.number.int({
			min: MIN_RATING,
			max: MAX_RATING,
		});
		const outfieldError = outfieldArm;
		const outfieldRange = outfieldArm;
		const rf = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const sb = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const ss = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const tb = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const fielding = {
			c,
			catcherAbility,
			catcherArm,
			catcherFraming,
			cf,
			fb,
			infieldArm,
			infieldDoublePlay,
			infieldError,
			infieldRange,
			lf,
			outfieldArm,
			outfieldError,
			outfieldRange,
			rf,
			sb,
			ss,
			tb,
		};

		// Pitches
		const changeup = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const curveball = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const cutter = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const eephus = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const fastball = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const forkball = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const knuckleball = faker.number.int({
			min: MIN_RATING,
			max: MAX_RATING,
		});
		const knuckleCurve = faker.number.int({
			min: MIN_RATING,
			max: MAX_RATING,
		});
		const screwball = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const sinker = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const slider = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const slurve = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const splitter = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const sweeper = faker.number.int({ min: MIN_RATING, max: MAX_RATING });

		const pitches = {
			changeup,
			curveball,
			cutter,
			eephus,
			fastball,
			forkball,
			knuckleball,
			knuckleCurve,
			screwball,
			sinker,
			slider,
			slurve,
			splitter,
			sweeper,
		};

		// Pitching
		const control = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const movement = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const stamina = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const stuff = faker.number.int({ min: MIN_RATING, max: MAX_RATING });

		const pitching = {
			control,
			controlVL: control,
			controlVR: control,
			movement,
			movementVL: movement,
			movementVR: movement,
			stamina,
			stuff,
			stuffVL: stuff,
			stuffVR: stuff,
		};

		// Running
		const speed = faker.number.int({ min: MIN_RATING, max: MAX_RATING });
		const running = {
			baserunning: speed,
			speed,
			stealing: speed,
		};

		const idTeam = idTeamIndex;

		idTeamIndex++;

		if (idTeamIndex > seedTeams.length) {
			idTeamIndex = 1;
		}

		return {
			batting,
			fielding,
			idPerson: person.idPerson,
			idPlayer: i + 1,
			idTeam,
			pitches,
			pitching,
			running,
		};
	});

	const insertPlayer = db.prepare(/*sql*/ `
      insert into players (idPerson, idPlayer, idTeam) values ($idPerson, $idPlayer, $idTeam);
   `);

	const insertPlayers = db.transaction(() => {
		for (const seedPlayer of seedPlayers) {
			insertPlayer.run({
				idPlayer: seedPlayer.idPlayer,
				idPerson: seedPlayer.idPerson,
				idTeam: seedPlayer.idTeam,
			});
		}
	});

	insertPlayers(seedPlayers);

	const insertPlayerBatting = db.prepare(/*sql*/ `
      insert into playersBatting (idPlayer, avoidKs, avoidKsVL, avoidKsVR, contact, contactVL, contactVR, eye, eyeVL, eyeVR, gap, gapVL, gapVR, power, powerVL, powerVR) values ($idPlayer, $avoidKs, $avoidKsVL, $avoidKsVR, $contact, $contactVL, $contactVR, $eye, $eyeVL, $eyeVR, $gap, $gapVL, $gapVR, $power, $powerVL, $powerVR);
   `);

	const insertPlayersBatting = db.transaction(() => {
		for (const seedPlayer of seedPlayers) {
			insertPlayerBatting.run({
				idPlayer: seedPlayer.idPlayer,
				avoidKs: seedPlayer.batting.avoidKs,
				avoidKsVL: seedPlayer.batting.avoidKsVL,
				avoidKsVR: seedPlayer.batting.avoidKsVR,
				contact: seedPlayer.batting.contact,
				contactVL: seedPlayer.batting.contactVL,
				contactVR: seedPlayer.batting.contactVR,
				eye: seedPlayer.batting.eye,
				eyeVL: seedPlayer.batting.eyeVL,
				eyeVR: seedPlayer.batting.eyeVR,
				gap: seedPlayer.batting.gap,
				gapVL: seedPlayer.batting.gapVL,
				gapVR: seedPlayer.batting.gapVR,
				power: seedPlayer.batting.power,
				powerVL: seedPlayer.batting.powerVL,
				powerVR: seedPlayer.batting.powerVR,
			});
		}
	});

	insertPlayersBatting(seedPlayers);

	const insertPlayerFielding = db.prepare(/*sql*/ `
      insert into playersFielding (idPlayer, c, catcherAbility, catcherArm, catcherFraming, cf, fb, infieldArm, infieldDoublePlay, infieldError, infieldRange, lf, outfieldArm, outfieldError, outfieldRange, rf, sb, ss, tb) values ($idPlayer, $c, $catcherAbility, $catcherArm, $catcherFraming, $cf, $fb, $infieldArm, $infieldDoublePlay, $infieldError, $infieldRange, $lf, $outfieldArm, $outfieldError, $outfieldRange, $rf, $sb, $ss, $tb);
   `);

	const insertPlayersFielding = db.transaction(() => {
		for (const seedPlayer of seedPlayers) {
			insertPlayerFielding.run({
				idPlayer: seedPlayer.idPlayer,
				c: seedPlayer.fielding.c,
				catcherAbility: seedPlayer.fielding.catcherAbility,
				catcherArm: seedPlayer.fielding.catcherArm,
				catcherFraming: seedPlayer.fielding.catcherFraming,
				cf: seedPlayer.fielding.cf,
				fb: seedPlayer.fielding.fb,
				infieldArm: seedPlayer.fielding.infieldArm,
				infieldDoublePlay: seedPlayer.fielding.infieldDoublePlay,
				infieldError: seedPlayer.fielding.infieldError,
				infieldRange: seedPlayer.fielding.infieldRange,
				lf: seedPlayer.fielding.lf,
				outfieldArm: seedPlayer.fielding.outfieldArm,
				outfieldError: seedPlayer.fielding.outfieldError,
				outfieldRange: seedPlayer.fielding.outfieldRange,
				rf: seedPlayer.fielding.rf,
				sb: seedPlayer.fielding.sb,
				ss: seedPlayer.fielding.ss,
				tb: seedPlayer.fielding.tb,
			});
		}
	});

	insertPlayersFielding(seedPlayers);

	const insertPlayerPitches = db.prepare(/*sql*/ `
      insert into playersPitches (idPlayer, changeup, curveball, cutter, eephus, fastball, forkball, knuckleball, knuckleCurve, screwball, sinker, slider, slurve, splitter, sweeper) values ($idPlayer, $changeup, $curveball, $cutter, $eephus, $fastball, $forkball, $knuckleball, $knuckleCurve, $screwball, $sinker, $slider, $slurve, $splitter, $sweeper);
   `);

	const insertPlayersPitches = db.transaction(() => {
		for (const seedPlayer of seedPlayers) {
			insertPlayerPitches.run({
				idPlayer: seedPlayer.idPlayer,
				changeup: seedPlayer.pitches.changeup,
				curveball: seedPlayer.pitches.curveball,
				cutter: seedPlayer.pitches.cutter,
				eephus: seedPlayer.pitches.eephus,
				fastball: seedPlayer.pitches.fastball,
				forkball: seedPlayer.pitches.forkball,
				knuckleball: seedPlayer.pitches.knuckleball,
				knuckleCurve: seedPlayer.pitches.knuckleCurve,
				screwball: seedPlayer.pitches.screwball,
				sinker: seedPlayer.pitches.sinker,
				slider: seedPlayer.pitches.slider,
				slurve: seedPlayer.pitches.slurve,
				splitter: seedPlayer.pitches.splitter,
				sweeper: seedPlayer.pitches.sweeper,
			});
		}
	});

	insertPlayersPitches(seedPlayers);

	const insertPlayerPitching = db.prepare(/*sql*/ `
      insert into playersPitching (idPlayer, control, controlVL, controlVR, movement, movementVL, movementVR, stamina, stuff, stuffVL, stuffVR) values ($idPlayer, $control, $controlVL, $controlVR, $movement, $movementVL, $movementVR, $stamina, $stuff, $stuffVL, $stuffVR);
   `);

	const insertPlayersPitching = db.transaction(() => {
		for (const seedPlayer of seedPlayers) {
			insertPlayerPitching.run({
				idPlayer: seedPlayer.idPlayer,
				control: seedPlayer.pitching.control,
				controlVL: seedPlayer.pitching.controlVL,
				controlVR: seedPlayer.pitching.controlVR,
				movement: seedPlayer.pitching.movement,
				movementVL: seedPlayer.pitching.movementVL,
				movementVR: seedPlayer.pitching.movementVR,
				stamina: seedPlayer.pitching.stamina,
				stuff: seedPlayer.pitching.stuff,
				stuffVL: seedPlayer.pitching.stuffVL,
				stuffVR: seedPlayer.pitching.stuffVR,
			});
		}
	});

	insertPlayersPitching(seedPlayers);

	const insertPlayerRunning = db.prepare(/*sql*/ `
      insert into playersRunning (idPlayer, baserunning, speed, stealing) values ($idPlayer, $baserunning, $speed, $stealing);
   `);

	const insertPlayersRunning = db.transaction(() => {
		for (const seedPlayer of seedPlayers) {
			insertPlayerRunning.run({
				idPlayer: seedPlayer.idPlayer,
				baserunning: seedPlayer.running.baserunning,
				speed: seedPlayer.running.speed,
				stealing: seedPlayer.running.stealing,
			});
		}
	});

	insertPlayersRunning(seedPlayers);
} catch (error) {
	console.error("Error: ", error);
}

console.info("Finished seeding baseball-simulator!");