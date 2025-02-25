import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./ThemeToggle"

export function NavBar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Health Verification
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className={isActive("/dashboard")}>
              Dashboard
            </Link>
            <Link href="/analytics" className={isActive("/analytics")}>
              Analytics
            </Link>
            <Link href="/research-config" className={isActive("/research-config")}>
              Research Config
            </Link>
            <Link href="/influencer-search" className={isActive("/influencer-search")}>
              Search
            </Link>
            <Link href="/influencer-list" className={isActive("/influencer-list")}>
              Influencers
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

