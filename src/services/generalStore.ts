import DbClient from "@baseball-simulator/utils/db/DbClient";
import { Store } from "@tanstack/react-store";
import { type Input, instance, nullable, object, picklist } from "valibot";

const VStore = object({
   colorMode: picklist(["light", "dark"]),
   dbClient: nullable(instance(DbClient)),
   theme: picklist(["pink", "blue"]),
});
type TStore = Input<typeof VStore>;

const dbClient = new DbClient({
   name: "store",
});

await dbClient.init();

export const generalStore = new Store<TStore>({
   colorMode: "light",
   // dbClient: null,
   dbClient,
   theme: "pink",
});
