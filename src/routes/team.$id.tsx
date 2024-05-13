import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/team/$id")({
   component: () => <div>Hello /team/$id!</div>,
});
