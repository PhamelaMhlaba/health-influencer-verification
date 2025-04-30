import type React from "react"
import { ThemeProvider } from "next-themes"
import { NavBar } from "@/Client/components/NavBar"
import "./styles/global.css"

export const metadata = {
  title: "Health Influencer Verification",
  description: "Admin panel for health influencer verification",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background">
            <NavBar />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


