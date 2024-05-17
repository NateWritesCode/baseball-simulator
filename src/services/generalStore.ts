import DbClient from "@/utils/db/DbClient";
import { Store } from "@tanstack/react-store";
import { type Input, array, instance, object, picklist, string } from "valibot";

const VStore = object({
   colorMode: picklist(["light", "dark"]),
   dbClient: instance(DbClient),
   gameNames: array(string()),
   // theme: picklist(["pink", "blue"]),
});
type TStore = Input<typeof VStore>;

export const generalStore = new Store<TStore>({
   colorMode: "dark",
   dbClient: new DbClient({ name: "default" }),
   gameNames: [],
   // theme: "pink",
});
