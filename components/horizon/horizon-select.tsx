"use client"

import { useId, useState } from "react"
import { ModalShell } from "./modal-shell"

type Project = {
  name: string
  category: string
  blurb: string
  trust: number
  tvl: string
  tags: string[]
  accent: string
  verification: {
    status: string
    lastReviewed: string
    riskLevel: "Low" | "Medium" | "Elevated"
    auditProvider: string | null
    teamVerification: string
    contractUrl: string
    contractIsDemo: boolean
    scoreExplanation: string
    methodology: string
  }
}

const PROJECTS: Project[] = [
  {
    name: "SolStake Vaults",
    category: "Liquid Staking",
    blurb: "Non-custodial SOL liquid staking with auto-compounding validator rewards.",
    trust: 98,
    tvl: "$142.6M",
    tags: ["Reviewed", "Non-custodial", "Demo data"],
    accent: "linear-gradient(135deg,#9945ff,#7a5cff)",
    verification: {
      status: "Passed Horizon review",
      lastReviewed: "Aug 28, 2026",
      riskLevel: "Low",
      auditProvider: "OtterSec (demo record)",
      teamVerification: "Team identity verified with Horizon (demo record)",
      contractUrl: "#",
      contractIsDemo: true,
      scoreExplanation:
        "The Horizon score weighs review recency, audit coverage, team verification, and historical incident data. 98 reflects a recent review with full coverage in this demo dataset.",
      methodology:
        "Horizon reviewers assess documentation, on-chain activity, audit reports, and team verification, then re-review on a recurring cycle. All figures shown here are demo content.",
    },
  },
  {
    name: "Nova Lend",
    category: "Money Market",
    blurb: "Over-collateralized lending markets with real-time risk isolation on Solana.",
    trust: 95,
    tvl: "$88.3M",
    tags: ["Reviewed", "Risk-isolated", "Demo data"],
    accent: "linear-gradient(135deg,#22d3ee,#19fb9b)",
    verification: {
      status: "Passed Horizon review",
      lastReviewed: "Sep 04, 2026",
      riskLevel: "Medium",
      auditProvider: null,
      teamVerification: "Team identity partially verified (demo record)",
      contractUrl: "#",
      contractIsDemo: true,
      scoreExplanation:
        "The Horizon score weighs review recency, audit coverage, team verification, and historical incident data. 95 reflects a recent review with a pending third-party audit in this demo dataset.",
      methodology:
        "Horizon reviewers assess documentation, on-chain activity, audit reports, and team verification, then re-review on a recurring cycle. All figures shown here are demo content.",
    },
  },
]

export function HorizonSelect() {
  const [detailsFor, setDetailsFor] = useState<Project | null>(null)
  const [launchFor, setLaunchFor] = useState<Project | null>(null)

  return (
    <section id="select" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
          Horizon Select
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Curated DApp Hub</h2>
        <p className="mt-3 text-muted-foreground">
          Every listed DApp passed Horizon&apos;s review process. Open the verification details on any
          listing to see how it was reviewed.
        </p>
      </div>

      {/* Review status banner */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-4">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6l7-3Z" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-cyan-200">Every listed DApp passed Horizon&apos;s review process</p>
          <p className="text-xs text-muted-foreground">
            Listings and review data shown here are demo content for this prototype.
          </p>
        </div>
        <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Demo data
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <ProjectCard
            key={p.name}
            project={p}
            onDetails={() => setDetailsFor(p)}
            onLaunch={() => setLaunchFor(p)}
          />
        ))}
      </div>

      <VerificationModal project={detailsFor} onClose={() => setDetailsFor(null)} />
      <ExternalLinkModal project={launchFor} onClose={() => setLaunchFor(null)} />
    </section>
  )
}

function ProjectCard({
  project,
  onDetails,
  onLaunch,
}: {
  project: Project
  onDetails: () => void
  onLaunch: () => void
}) {
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
            aria-hidden="true"
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

      <p className="relative mt-4 text-sm text-foreground/90">{project.blurb}</p>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {project.tags.map((b) => {
          const isDemo = b === "Demo data"
          return (
            <span
              key={b}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                isDemo
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                  : "border-white/10 bg-white/5 text-foreground/90"
              }`}
            >
              {isDemo ? (
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-3 w-3 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {b}
            </span>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onDetails}
        className="relative mt-4 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-cyan-200 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6l7-3Z" strokeLinejoin="round" />
        </svg>
        View Verification Details
      </button>

      <div className="relative mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Total Value Locked (demo)</p>
          <p className="text-lg font-semibold tabular-nums">{project.tvl}</p>
        </div>
        <button
          type="button"
          onClick={onLaunch}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Launch DApp
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </article>
  )
}

function riskTone(level: Project["verification"]["riskLevel"]) {
  if (level === "Low") return "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
  if (level === "Medium") return "border-amber-400/40 bg-amber-400/10 text-amber-200"
  return "border-red-400/40 bg-red-400/10 text-red-200"
}

function VerificationModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const titleId = useId()
  const descId = useId()
  if (!project) return null
  const v = project.verification

  return (
    <ModalShell open onClose={onClose} labelledBy={titleId} describedBy={descId} className="max-w-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 id={titleId} className="text-lg font-semibold">{project.name} — Verification</h3>
            <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-200">DEMO DATA</span>
          </div>
          <p id={descId} className="mt-0.5 text-sm text-muted-foreground">
            Review record for this listing. All values are demo content.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <dl className="space-y-3">
        <DetailRow label="Review status" value={v.status} />
        <DetailRow label="Last reviewed" value={v.lastReviewed} />
        <div className="flex items-center justify-between gap-3">
          <dt className="text-sm text-muted-foreground">Risk level</dt>
          <dd className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${riskTone(v.riskLevel)}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            {v.riskLevel}
          </dd>
        </div>
        <DetailRow label="Audit provider" value={v.auditProvider ?? "No third-party audit on record"} />
        <DetailRow label="Team verification" value={v.teamVerification} />
        <div className="flex items-center justify-between gap-3">
          <dt className="text-sm text-muted-foreground">Smart contract</dt>
          <dd className="text-right text-sm">
            <a
              href={v.contractUrl}
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-1.5 rounded-md text-cyan-200 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              View contract
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {v.contractIsDemo && <span className="mt-0.5 block text-[11px] text-amber-200">Demo link — not a real contract</span>}
          </dd>
        </div>
      </dl>

      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">How the Horizon score works</p>
          <p className="mt-2 text-sm text-foreground/90">{v.scoreExplanation}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Review methodology</p>
          <p className="mt-2 text-sm text-foreground/90">{v.methodology}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Close
      </button>
    </ModalShell>
  )
}

function ExternalLinkModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const titleId = useId()
  const descId = useId()
  if (!project) return null
  const isDemoLink = project.verification.contractIsDemo || project.verification.contractUrl === "#"

  return (
    <ModalShell open onClose={onClose} labelledBy={titleId} describedBy={descId}>
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cyan-400/15 text-cyan-300">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 id={titleId} className="mt-4 text-lg font-semibold">You are about to open an external protocol</h3>
        <p id={descId} className="mt-1 text-sm text-muted-foreground">
          {`${project.name} runs outside of Horizon. Always confirm the URL before connecting a wallet or approving transactions.`}
        </p>

        {isDemoLink && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Demo link — this prototype has no real destination
          </p>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isDemoLink}
          title={isDemoLink ? "Disabled in this demo" : undefined}
          className="flex-1 rounded-xl brand-gradient-bg px-4 py-3 text-sm font-semibold text-white glow-purple transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDemoLink ? "Unavailable in Demo" : "Continue"}
        </button>
      </div>
    </ModalShell>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] text-right text-sm text-foreground/90">{value}</dd>
    </div>
  )
}

function TrustScore({ score }: { score: number }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="relative grid h-14 w-14 place-items-center" title={`Horizon score ${score} of 100 (demo)`}>
      <svg viewBox="0 0 48 48" className="h-14 w-14 -rotate-90" aria-hidden="true">
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
      <span className="sr-only">Horizon score {score} out of 100 (demo data)</span>
    </div>
  )
}
