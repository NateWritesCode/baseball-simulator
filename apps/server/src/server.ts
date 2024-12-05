import { Database } from "bun:sqlite";
import { Hono } from "hono";
import { hc } from "hono/client";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import fs from "node:fs";
import analyzeSimulation from "./data/analyzeSimulation";
import analyze from "./db/analyze";
import {
	game,
	league,
	person,
	player,
	simulate,
	standings,
	team,
	universe,
} from "./routes";
import { simulateGames } from "./routes/simulate";

export type TMiddleware = {
	Variables: {
		db: Database;
		idSession: string;
	};
};

const db = new Database(`${import.meta.dir}/db/baseball-simulator.db`, {
	strict: true,
});

const middlewareVariables = createMiddleware<TMiddleware>(async (c, next) => {
	const db = new Database(`${import.meta.dir}/db/baseball-simulator.db`, {
		strict: true,
	});

	const idSession = c.req.header("x-idSession") || "";

	c.set("db", db);
	c.set("idSession", idSession);
	await next();
});

const app = new Hono<{ Variables: TMiddleware["Variables"] }>();

app.use(
	cors({
		origin: "http://localhost:3000",
	}),
);

app.use(middlewareVariables);

const routes = app
	.route("/game", game)
	.route("/league", league)
	.route("/player", player)
	.route("/person", person)
	.route("/simulate", simulate)
	.route("/standings", standings)
	.route("/team", team)
	.route("/universe", universe);

export const client = hc<typeof routes>("");
export type THonoClient = typeof routes;

const simulationJson =
	"/home/nathanh81/Projects/baseball-simulator/apps/server/src/data/test/simulation.json";

if (fs.existsSync(simulationJson)) {
	fs.rmSync(simulationJson);
}

await simulateGames({
	db,
	simulationLength: "oneDay",
});

await analyze();

await analyzeSimulation();

export default {
	idleTimeout: 60,
	port: 8080,
	fetch: app.fetch,
};
