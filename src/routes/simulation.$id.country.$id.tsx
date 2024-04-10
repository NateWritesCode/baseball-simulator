import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/simulation/$id/country/$id")({
   component: () => <div>Hello /simulation/$id/country/$id!</div>,
});
