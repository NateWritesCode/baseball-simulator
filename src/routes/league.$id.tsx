import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/league/$id")({
   component: () => <div>Hello /league/$id!</div>,
});
