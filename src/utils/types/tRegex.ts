import { regex } from "valibot";

export const VRegexDate = regex(
   /^(\d{4})-(\d{2})-(\d{2})$/,
   "Does not match date in YYYY-MM-DD format",
);

export const VRegexHexColor = regex(
   /^#[a-f\d]{6}$/i,
   "Does not match hex color in #RRGGBB format",
);

export const VRegexSlug = regex(
   /^[a-z-\d]+$/,
   "Does not match slug with letters and numbers only",
);

export const ZRegexSlugLettersOnly = regex(
   /^[a-z-]+$/,
   "Does not match slug with letters only",
);
