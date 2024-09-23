import { Database } from "bun:sqlite";
import { Hono } from "hono";
import { hc } from "hono/client";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { player } from "./routes";

export type TMiddleware = {
	Variables: {
		db: Database;
		idSession: string;
	};
};

const middlewareVariables = createMiddleware<TMiddleware>(async (c, next) => {
	const db = new Database(`${import.meta.dir}/db/baseball-simulator.db`, {
		safeIntegers: true,
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

const routes = app.route("/player", player);

export const client = hc<typeof routes>("");
export type THonoClient = typeof routes;

export default {
	port: 8080,
	fetch: app.fetch,
};
