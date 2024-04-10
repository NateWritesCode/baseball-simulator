import getRandom0or1 from "./fGetRandom0or1";

import { describe, expect, test } from "bun:test";

describe("getRandom0or1", () => {
   test("should return 0 or 1", () => {
      const result = getRandom0or1();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
   });
});
