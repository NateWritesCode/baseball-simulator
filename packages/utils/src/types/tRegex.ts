import { type InferOutput, pipe, regex, string } from "valibot";

export const VRegexDateTimeIsoString = pipe(
	string(),
	regex(
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
		"Expected a date time string in ISO format",
	),
);
export type TRegexDateTimeIsoString = InferOutput<
	typeof VRegexDateTimeIsoString
>;
