import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/park/$id')({
  component: () => <div>Hello /park/$id!</div>
})