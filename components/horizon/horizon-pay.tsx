"use client"

import { useId, useMemo, useState } from "react"
import { PaymentModal } from "./payment-modal"
import { useWallet } from "./wallet-context"
import { HZC_PER_USD, MAX_DEMO_PAYMENT, formatHzc, formatSol, validateAmount } from "@/lib/demo"

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"]

function sanitize(next: string): string | null {
  // allow only digits and a single decimal point
  if (!/^\d*\.?\d*$/.test(next)) return null
  if ((next.match(/\./g)?.length ?? 0) > 1) return null
  const [intPart, decPart] = next.split(".")
  if (decPart && decPart.length > 2) return null
  if (intPart.replace(/^0+(?=\d)/, "").length > 6) return null // cap integer digits
  return next
}

export function HorizonPay() {
  const [raw, setRaw] = useState("25.00")
  const [touched, setTouched] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { status: walletStatus, network } = useWallet()

  const inputId = useId()
  const errorId = useId()

  const validation = useMemo(() => validateAmount(raw), [raw])
  const usdNum = validation.ok ? validation.value : 0
  const usd = raw === "" ? "0" : raw

  const hzc = useMemo(() => formatHzc(usdNum), [usdNum])
  const sol = useMemo(() => formatSol(usdNum), [usdNum])

  const showError = touched && !validation.ok

  function apply(next: string) {
    const clean = sanitize(next)
    if (clean === null) return
    setTouched(true)
    setRaw(clean)
  }

  function press(key: string) {
    if (key === "back") {
      setTouched(true)
      setRaw((prev) => prev.slice(0, -1))
      return
    }
    apply(raw + key)
  }

  function generate() {
    setTouched(true)
    if (!validation.ok) return
    setModalOpen(true)
  }

  return (
    <section id="pay" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Horizon Pay"
        title="Merchant POS Terminal"
        description="Accept fast crypto payments in HZC. Enter an amount and generate a Solana payment request in seconds."
      />

      {/* Demo Mode explanation */}
      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] p-4">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-amber-100">Demo Mode</p>
          <p className="mt-0.5 text-sm text-amber-100/80">
            Demo Mode lets you explore the merchant payment flow without connecting a wallet or moving real funds.
            Wallet connection is optional in Demo Mode.
          </p>
        </div>
      </div>

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

          {/* Accessible amount input */}
          <div className="mt-6">
            <label htmlFor={inputId} className="block text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Amount (USD)
            </label>
            <div className="mt-2 flex items-center justify-center gap-1">
              <span className="text-4xl font-semibold text-muted-foreground sm:text-5xl" aria-hidden="true">$</span>
              <input
                id={inputId}
                inputMode="decimal"
                type="text"
                value={raw}
                onChange={(e) => apply(e.target.value)}
                onBlur={() => setTouched(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") generate()
                }}
                placeholder="0.00"
                aria-invalid={showError}
                aria-describedby={showError ? errorId : undefined}
                className="w-[6ch] bg-transparent text-center text-5xl font-semibold tabular-nums tracking-tight caret-primary outline-none placeholder:text-muted-foreground/40 sm:w-[7ch] sm:text-6xl"
              />
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTouched(true)
                  setRaw("")
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-foreground/80 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => press("back")}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-foreground/80 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Backspace
              </button>
            </div>

            <p id={errorId} role="alert" className={`mt-3 min-h-5 text-center text-sm ${showError ? "text-red-300" : "text-transparent"}`}>
              {showError && !validation.ok ? validation.message : "\u00A0"}
            </p>
          </div>

          {/* Keypad */}
          <div className="mx-auto mt-2 grid max-w-xs grid-cols-3 gap-2.5" role="group" aria-label="Number pad">
            {KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => press(k)}
                className="grid h-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-lg font-medium transition-all hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95"
                aria-label={k === "back" ? "Delete last digit" : k === "." ? "Decimal point" : `Digit ${k}`}
              >
                {k === "back" ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
                onClick={() => {
                  setTouched(true)
                  setRaw(amt.toFixed(2))
                }}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {`$${amt}`}
              </button>
            ))}
          </div>
        </div>

        {/* Conversion + CTA */}
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-white/10 glass p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Instant Conversion</p>
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-200">DEMO</span>
            </div>
            <div className="mt-4 space-y-3">
              <ConversionRow
                token="HZC"
                sub="Horizon Coin · demo token"
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
              <span>Demo exchange rate</span>
              <span className="tabular-nums">1 USD ≈ {HZC_PER_USD} HZC</span>
            </div>
            <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-muted-foreground">
              HZC is a demo token used for payment simulation in this prototype.
            </p>
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={!validation.ok}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl brand-gradient-bg px-6 py-4 text-base font-semibold text-white glow-purple transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <path d="M14 14h3v3M21 14v.01M17 21h4M21 17v4" strokeLinecap="round" />
            </svg>
            Generate QR Code for Payment
          </button>

          <div className="flex flex-col gap-1 text-center text-xs text-muted-foreground">
            <p>Maximum demo payment is ${MAX_DEMO_PAYMENT.toLocaleString("en-US")}.</p>
            <p className="flex items-center justify-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${walletStatus === "connected" ? "bg-emerald-400" : "bg-amber-400"}`} aria-hidden="true" />
              {walletStatus === "connected"
                ? `Wallet connected · ${network}`
                : "Wallet connection is optional in Demo Mode."}
            </p>
          </div>
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
        <span className="grid h-10 w-10 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: gradient }} aria-hidden="true">
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
