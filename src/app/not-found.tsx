import { NotFoundState } from "@/components/states/not-found-state"

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col bg-background px-4 py-10">
      <NotFoundState className="flex-1" />
    </main>
  )
}
