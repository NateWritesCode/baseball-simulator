import { Hono } from "hono";
import { VApiParamsPlayer } from "@baseball-simulator/utils/types";

const player = new Hono();

player.get("/", (c) => c.text("List of players"));
player.get("/:id", (c) => c.text(`Player with id ${c.params.id}`));
