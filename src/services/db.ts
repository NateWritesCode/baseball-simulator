import DbClient from "@baseball-simulator/utils/db/DbClient";

export const dbClient = new DbClient();

export const dbStore = dbClient.store;

(async () => {
   await dbClient.init();
})();
