import Link from "next/link"

import { BackButton } from "@/components/back-button"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NotFoundStateProps = {
  homeHref?: string
  homeLabel?: string
  className?: string
}

export function NotFoundState({
  homeHref = "/",
  homeLabel = "Zur Startseite",
  className,
}: NotFoundStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        {/* <p className="text-sm font-medium text-muted-foreground">404</p> */}
        <span className='from-foreground bg-linear-to-b to-transparent bg-clip-text text-[10rem] leading-none font-extrabold text-transparent'>
        404
      </span>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Seite nicht gefunden
        </h1>
        <p className="max-w-md text-muted-foreground">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <BackButton label="Zurück" variant="default" />
        <Link href={homeHref} className={cn(buttonVariants())}>
          {homeLabel}
        </Link>
      </div>
    </div>
  )
}
