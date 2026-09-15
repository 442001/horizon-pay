const PROJECTS = [
  {
    name: "SolStake Vaults",
    category: "Liquid Staking",
    blurb: "Non-custodial SOL liquid staking with auto-compounding validator rewards.",
    trust: 98,
    tvl: "$142.6M",
    badges: ["Audit Verified", "Anti-Rug Check", "KYC'd Team"],
    accent: "linear-gradient(135deg,#9945ff,#7a5cff)",
  },
  {
    name: "Nova Lend",
    category: "Money Market",
    blurb: "Over-collateralized lending markets with real-time risk isolation on Solana.",
    trust: 95,
    tvl: "$88.3M",
    badges: ["Audit Verified", "Anti-Rug Check", "Insurance Fund"],
    accent: "linear-gradient(135deg,#22d3ee,#19fb9b)",
  },
] as const

export function HorizonSelect() {
  return (
    <section id="select" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
          Horizon Select
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Curated DApp Hub</h2>
        <p className="mt-3 text-muted-foreground">
          Every protocol is manually vetted, audited, and continuously monitored. Only high-utility,
          security-first projects make the cut.
        </p>
      </div>

      {/* Filter status banner */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/15 text-emerald-400">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6l7-3Z" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-emerald-300">0% Low-Utility Projects Allowed</p>
          <p className="text-xs text-muted-foreground">
            Filter active · 1,240+ submissions screened · 2 approved this cycle
          </p>
        </div>
        <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live filtering
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 glass p-6 transition-all hover:border-white/20">
      <div
        className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40"
        style={{ background: project.accent }}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="grid h-12 w-12 place-items-center rounded-2xl text-lg font-bold text-white"
            style={{ background: project.accent }}
          >
            {project.name.charAt(0)}
          </span>
          <div>
            <h3 className="font-semibold leading-tight">{project.name}</h3>
            <p className="text-xs text-muted-foreground">{project.category}</p>
          </div>
        </div>
        <TrustScore score={project.trust} />
      </div>

      <p className="relative mt-4 text-sm text-foreground/80">{project.blurb}</p>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {project.badges.map((b) => (
          <span
            key={b}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-foreground/80"
          >
            <svg viewBox="0 0 24 24" className="h-3 w-3 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {b}
          </span>
        ))}
      </div>

      <div className="relative mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Total Value Locked</p>
          <p className="text-lg font-semibold tabular-nums">{project.tvl}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
        >
          Launch DApp
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </article>
  )
}

function TrustScore({ score }: { score: number }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="relative grid h-14 w-14 place-items-center">
      <svg viewBox="0 0 48 48" className="h-14 w-14 -rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-white/10" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="#19fb9b"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <span className="block text-sm font-bold leading-none tabular-nums">{score}</span>
        <span className="block text-[8px] uppercase tracking-wide text-muted-foreground">score</span>
      </div>
    </div>
  )
}
