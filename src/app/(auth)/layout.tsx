import { ThemeMenu } from "@/components/theme-menu"
import { BackButton } from "@/components/back-button"

type AuthLayoutProps = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex flex-1 flex-col bg-background">
      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <BackButton />
        <div className="ml-auto">
          <ThemeMenu />
        </div>
      </div>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  )
}
