"use client"

import { useEffect, useState } from "react"
import { QrCode } from "./qr-code"

type Status = "pending" | "processing" | "success"

export function PaymentModal({
  open,
  onClose,
  usd,
  hzc,
  sol,
}: {
  open: boolean
  onClose: () => void
  usd: string
  hzc: string
  sol: string
}) {
  const [status, setStatus] = useState<Status>("pending")

  useEffect(() => {
    if (open) setStatus("pending")
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  function simulate() {
    setStatus("processing")
    setTimeout(() => setStatus("success"), 1600)
  }

  const reference = `HZP-${usd.replace(".", "")}-8F3A`

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Horizon Pay payment"
    >
      <button
        type="button"
        aria-label="Close payment"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        className="relative w-full max-w-sm rounded-3xl border border-white/10 glass p-6 shadow-2xl"
        style={{ animation: "horizon-float 6s ease-in-out infinite" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Horizon Pay
            </p>
            <p className="text-sm text-foreground/80">Scan to pay with $HZC</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:bg-white/10"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {status !== "success" ? (
          <>
            <div className="relative mx-auto w-fit">
              <QrCode value={reference} className="relative" />
              {status === "processing" && (
                <div className="absolute inset-3 grid place-items-center rounded-md bg-white/80 backdrop-blur-sm">
                  <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#9945ff]/30 border-t-[#9945ff]" />
                </div>
              )}
            </div>

            <div className="mt-5 space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Row label="Amount due" value={`$${usd}`} bold />
              <Row label="$HZC" value={hzc} />
              <Row label="SOL" value={sol} />
              <Row label="Reference" value={reference} mono />
            </div>

            <button
              type="button"
              onClick={simulate}
              disabled={status === "processing"}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl brand-gradient-bg px-4 py-3 text-sm font-semibold text-white glow-purple transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
            >
              {status === "processing" ? "Awaiting confirmation…" : "Simulate Payment Success"}
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Settled on Solana Mainnet · avg. finality ~0.4s
            </p>
          </>
        ) : (
          <SuccessView usd={usd} hzc={hzc} reference={reference} onClose={onClose} />
        )}
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  bold,
  mono,
}: {
  label: string
  value: string
  bold?: boolean
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`${bold ? "font-semibold text-foreground" : "text-foreground/90"} ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  )
}

function SuccessView({
  usd,
  hzc,
  reference,
  onClose,
}: {
  usd: string
  hzc: string
  reference: string
  onClose: () => void
}) {
  return (
    <div className="py-4 text-center">
      <div
        className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400/15"
        style={{ animation: "horizon-pulse-ring 1.8s infinite" }}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold">Payment Confirmed</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {`$${usd} · ${hzc} received`}
      </p>

      <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
        <Row label="Status" value="Finalized" />
        <Row label="Network" value="Solana Mainnet" />
        <Row label="Reference" value={reference} mono />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
      >
        New Transaction
      </button>
    </div>
  )
}
