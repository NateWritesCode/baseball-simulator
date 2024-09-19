import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono().use(cors());

const router = app.get("/ping", async (c) => {
	return c.json({ message: "pong" });
});

export default {
	port: 8080,
	fetch: app.fetch,
};
