import { object, string } from "valibot";

export const VDbPlayer = object({
	firstName: string(),
	lastName: string(),
});
