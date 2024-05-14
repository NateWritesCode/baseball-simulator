import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/division/$id')({
  component: () => <div>Hello /division/$id!</div>
})