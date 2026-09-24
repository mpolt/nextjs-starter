import { LoadingState } from "@/components/states/loading-state"

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <LoadingState variant="full" />
    </main>
  )
}
