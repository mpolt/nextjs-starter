import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type LoadingStateProps = {
  variant?: "full" | "content"
  className?: string
}

export function LoadingState({
  variant = "full",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        variant === "full" &&
          "flex-1 items-center justify-center px-4 py-10",
        variant === "content" && "w-full max-w-2xl",
        className
      )}
      role="status"
      aria-label="Wird geladen"
    >
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-md" />
      <Skeleton className="h-4 w-3/4 max-w-sm" />
      <Skeleton className="mt-2 h-24 w-full max-w-md" />
    </div>
  )
}
