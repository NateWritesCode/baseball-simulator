import { regex } from "valibot";

export const VRegexDate = regex(
   /^(\d{4})-(\d{2})-(\d{2})$/,
   "Does not match date in YYYY-MM-DD format",
);
