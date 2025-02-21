import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 py-12">
          <h1 className="magical-text text-5xl font-bold floating">
            Health Influencer Verification
          </h1>
          <p className="text-xl text-muted-foreground">
            Admin Panel for Managing Health Influencers
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 px-4">
          {/* Influencers Card */}
          <Link
            href="/influencers"
            className="glass-card group p-8 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <h2 className="text-2xl font-semibold mb-3 magical-text">
              Influencers
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none ml-2">
                →
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              View and manage health influencers.
            </p>
          </Link>

          {/* Analytics Card */}
          <Link
            href="/analytics"
            className="glass-card group p-8 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <h2 className="text-2xl font-semibold mb-3 magical-text">
              Analytics
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none ml-2">
                →
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              View overall system analytics and performance metrics.
            </p>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 magical-gradient rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-32 h-32 magical-gradient rounded-full opacity-20 blur-3xl" />
      </div>
    </main>
  )
}