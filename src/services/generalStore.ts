import { Store } from "@tanstack/react-store";
import { type Input, object, picklist } from "valibot";

const VStore = object({
   colorMode: picklist(["light", "dark"]),
   theme: picklist(["pink", "blue"]),
});
type TStore = Input<typeof VStore>;

export const generalStore = new Store<TStore>({
   colorMode: "light",
   theme: "pink",
});
