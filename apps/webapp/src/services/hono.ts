import type { THonoClient } from "@baseball-simulator/server";
import { uuid } from "@baseball-simulator/utils/functions";
import { hc } from "hono/client";

export const honoClient = hc<THonoClient>("http://localhost:8080", {
	headers: {
		"x-idSession": uuid(),
	},
});
