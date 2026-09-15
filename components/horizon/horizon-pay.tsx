"use client"

import { useMemo, useState } from "react"
import { PaymentModal } from "./payment-modal"

// Mock market rates
const HZC_PER_USD = 4.7382 // 1 USD ≈ 4.7382 HZC
const SOL_PER_USD = 0.00553 // 1 USD ≈ 0.00553 SOL

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"]

export function HorizonPay() {
  const [raw, setRaw] = useState("25.00")
  const [modalOpen, setModalOpen] = useState(false)

  const usd = raw === "" ? "0" : raw
  const usdNum = Number.parseFloat(usd) || 0

  const hzc = useMemo(() => (usdNum * HZC_PER_USD).toLocaleString("en-US", { maximumFractionDigits: 2 }), [usdNum])
  const sol = useMemo(() => (usdNum * SOL_PER_USD).toLocaleString("en-US", { maximumFractionDigits: 4 }), [usdNum])

  function press(key: string) {
    setRaw((prev) => {
      if (key === "back") return prev.slice(0, -1)
      if (key === "." && prev.includes(".")) return prev
      const next = prev + key
      // limit to 2 decimals
      if (next.includes(".") && next.split(".")[1]?.length > 2) return prev
      if (next.replace(".", "").length > 8) return prev
      return next
    })
  }

  return (
    <section id="pay" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Horizon Pay"
        title="Merchant POS Terminal"
        description="Accept stablecoin-fast payments in $HZC. Enter an amount and generate a Solana payment request in seconds."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Terminal */}
        <div className="rounded-3xl border border-white/10 glass p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Terminal #04 · Online
            </span>
            <span className="text-xs text-muted-foreground">USD</span>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Amount</p>
            <div className="mt-2 flex items-center justify-center">
              <span className="text-4xl font-semibold text-muted-foreground sm:text-5xl">$</span>
              <span className="text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl">
                {usd || "0"}
              </span>
              <span className="ml-1 h-10 w-0.5 animate-pulse bg-primary" aria-hidden="true" />
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-xs grid-cols-3 gap-2.5">
            {KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => press(k)}
                className="grid h-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-lg font-medium transition-all hover:bg-white/10 active:scale-95"
                aria-label={k === "back" ? "Delete" : k}
              >
                {k === "back" ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6H9l-5 6 5 6h11a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z" strokeLinejoin="round" />
                    <path d="M12 10l4 4M16 10l-4 4" strokeLinecap="round" />
                  </svg>
                ) : (
                  k
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[10, 25, 50, 100].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setRaw(amt.toFixed(2))}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-white/10"
              >
                {`$${amt}`}
              </button>
            ))}
          </div>
        </div>

        {/* Conversion + CTA */}
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-white/10 glass p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Instant Conversion
            </p>
            <div className="mt-4 space-y-3">
              <ConversionRow
                token="$HZC"
                sub="Horizon Coin"
                value={hzc}
                gradient="linear-gradient(135deg,#9945ff,#7a5cff)"
              />
              <ConversionRow
                token="SOL"
                sub="Solana"
                value={sol}
                gradient="linear-gradient(135deg,#22d3ee,#19fb9b)"
              />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-muted-foreground">
              <span>Live rate</span>
              <span className="tabular-nums">1 USD ≈ {HZC_PER_USD} HZC</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            disabled={usdNum <= 0}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl brand-gradient-bg px-6 py-4 text-base font-semibold text-white glow-purple transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <path d="M14 14h3v3M21 14v.01M17 21h4M21 17v4" strokeLinecap="round" />
            </svg>
            Generate QR Code for Payment
          </button>
          <p className="text-center text-xs text-muted-foreground">
            No chargebacks · settles directly to your merchant wallet
          </p>
        </div>
      </div>

      <PaymentModal open={modalOpen} onClose={() => setModalOpen(false)} usd={usd || "0"} hzc={hzc} sol={sol} />
    </section>
  )
}

function ConversionRow({
  token,
  sub,
  value,
  gradient,
}: {
  token: string
  sub: string
  value: string
  gradient: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: gradient }}>
          {token === "SOL" ? "◎" : "H"}
        </span>
        <div>
          <p className="font-semibold leading-tight">{token}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
      </div>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{description}</p>
    </div>
  )
}
