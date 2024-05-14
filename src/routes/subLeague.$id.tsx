import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/subLeague/$id')({
  component: () => <div>Hello /subLeague/$id!</div>
})