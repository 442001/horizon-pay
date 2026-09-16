import { SiteBackground } from "@/components/horizon/site-background"
import { Navbar } from "@/components/horizon/navbar"
import { HorizonPay } from "@/components/horizon/horizon-pay"
import { HorizonSelect } from "@/components/horizon/horizon-select"
import { WalletProvider } from "@/components/horizon/wallet-context"
import { DemoBadge } from "@/components/horizon/demo-badge"

export default function Page() {
  return (
    <WalletProvider>
      <SiteBackground />
      <Navbar />
      <main>
        <Hero />
        <HorizonPay />
        <HorizonSelect />
      </main>
      <Footer />
    </WalletProvider>
  )
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 pt-12 text-center sm:px-6 sm:pt-20">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ animation: "horizon-pulse-ring 2s infinite" }} />
          The Payments & Discovery Ecosystem on Solana
        </span>
        <DemoBadge />
      </div>
      <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
        Pay anywhere. Discover only what&apos;s <span className="brand-gradient-text">verified</span>.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground sm:text-lg">
        Horizon combines a lightning-fast merchant POS with a rigorously curated DApp hub — the
        premium gateway to Solana&apos;s best.
      </p>
      <p className="mx-auto mt-3 max-w-xl text-pretty text-sm text-amber-200/90">
        This is an interactive prototype. Everything runs in Demo Mode — no real funds are moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href="#pay"
          className="inline-flex items-center gap-2 rounded-xl brand-gradient-bg px-5 py-3 text-sm font-semibold text-white glow-purple transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Try Horizon Pay
        </a>
        <a
          href="#select"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Explore Horizon Select
        </a>
      </div>

      <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
        {[
          { v: "~0.4s", l: "Solana settlement" },
          { v: "$0.0002", l: "Avg. network fee" },
          { v: "2", l: "Curated DApps" },
        ].map((s) => (
          <div key={s.l}>
            <dt className="text-2xl font-semibold tracking-tight sm:text-3xl">{s.v}</dt>
            <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.l}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} Horizon Ecosystem. Prototype built on Solana Preview.</p>
        <p className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Demo experience · No real funds are moved
        </p>
      </div>
    </footer>
  )
}
