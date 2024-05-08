import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/workouts')({
  component: () => <div>Hello /_protected/dashboard/workouts!</div>
})