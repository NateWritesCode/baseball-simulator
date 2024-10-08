import { object, picklist } from "valibot";

export const VFormSchemaExplore = object({
	typeExplore: picklist(["person", "player"]),
});
