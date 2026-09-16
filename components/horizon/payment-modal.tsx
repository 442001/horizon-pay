"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { QrCode } from "./qr-code"
import { generateReference } from "@/lib/demo"

type Status = "generating" | "waiting" | "expired" | "processing" | "success" | "failed" | "insufficient"

const EXPIRY_SECONDS = 300

function formatCountdown(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

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
  const [status, setStatus] = useState<Status>("generating")
  const [reference, setReference] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS)
  const [copied, setCopied] = useState(false)

  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descId = useId()

  const startRequest = useCallback(() => {
    setStatus("generating")
    setReference(generateReference())
    setSecondsLeft(EXPIRY_SECONDS)
    setCopied(false)
    const t = window.setTimeout(() => setStatus("waiting"), 900)
    return () => window.clearTimeout(t)
  }, [])

  // Initialize a fresh request whenever the modal opens.
  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement as HTMLElement
    const cleanup = startRequest()
    return cleanup
  }, [open, startRequest])

  // Countdown timer while waiting.
  useEffect(() => {
    if (!open || status !== "waiting") return
    if (secondsLeft <= 0) {
      setStatus("expired")
      return
    }
    const t = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(t)
  }, [open, status, secondsLeft])

  // Escape + scroll lock + focus management.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key === "Tab") trapFocus(e)
    }
    function trapFocus(e: KeyboardEvent) {
      const root = dialogRef.current
      if (!root) return
      const focusable = root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 20)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      window.clearTimeout(focusTimer)
      previouslyFocused.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  function simulate(result: "success" | "failed" | "insufficient") {
    setStatus("processing")
    window.setTimeout(() => setStatus(result), 1600)
  }

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const isTerminalResult = status === "success" || status === "failed" || status === "insufficient"

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close payment dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className="relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-3xl border border-white/10 glass p-6 shadow-2xl outline-none"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p id={titleId} className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Horizon Pay
              </p>
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                DEMO
              </span>
            </div>
            <p className="mt-0.5 text-sm text-foreground/80">
              {isTerminalResult ? "Demo transaction result" : "Scan to preview a demo payment"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {status === "generating" && <GeneratingView descId={descId} />}

        {(status === "waiting" || status === "processing") && (
          <WaitingView
            descId={descId}
            reference={reference}
            usd={usd}
            hzc={hzc}
            sol={sol}
            secondsLeft={secondsLeft}
            processing={status === "processing"}
            copied={copied}
            onCopy={copyReference}
            onSimulate={simulate}
          />
        )}

        {status === "expired" && (
          <ExpiredView descId={descId} onRefresh={startRequest} />
        )}

        {status === "success" && (
          <SuccessView descId={descId} usd={usd} hzc={hzc} reference={reference} copied={copied} onCopy={copyReference} onRestart={startRequest} />
        )}

        {status === "failed" && (
          <FailureView descId={descId} onRetry={startRequest} />
        )}

        {status === "insufficient" && (
          <InsufficientView descId={descId} onRetry={startRequest} />
        )}
      </div>
    </div>
  )
}

function GeneratingView({ descId }: { descId: string }) {
  return (
    <div className="py-10 text-center" id={descId}>
      <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-primary/25 border-t-primary" aria-hidden="true" />
      <p className="mt-4 text-sm font-medium">Generating demo payment request…</p>
      <p className="mt-1 text-xs text-muted-foreground">Creating a reference and preview QR code.</p>
    </div>
  )
}

function WaitingView({
  descId,
  reference,
  usd,
  hzc,
  sol,
  secondsLeft,
  processing,
  copied,
  onCopy,
  onSimulate,
}: {
  descId: string
  reference: string
  usd: string
  hzc: string
  sol: string
  secondsLeft: number
  processing: boolean
  copied: boolean
  onCopy: () => void
  onSimulate: (r: "success" | "failed" | "insufficient") => void
}) {
  const low = secondsLeft <= 30
  return (
    <>
      <div className="relative mx-auto w-fit">
        <QrCode value={reference} className="relative" />
        {processing && (
          <div className="absolute inset-3 grid place-items-center rounded-md bg-white/85 backdrop-blur-sm">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#9945ff]/30 border-t-[#9945ff]" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${low ? "border-red-400/40 bg-red-400/10 text-red-200" : "border-white/10 bg-white/5 text-foreground/80"}`}>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2M9 2h6" strokeLinecap="round" />
          </svg>
          <span aria-live="polite">Expires in {formatCountdown(secondsLeft)}</span>
        </span>
      </div>

      <p id={descId} className="mt-4 text-center text-xs text-muted-foreground">
        Simulation only — no real funds will be transferred.
      </p>

      <div className="mt-3 space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <Row label="Amount due" value={`$${usd}`} bold />
        <Row label="HZC (demo token)" value={hzc} />
        <Row label="SOL" value={sol} />
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">Reference</span>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs text-foreground/90 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Copy reference ${reference}`}
          >
            {reference}
            {copied ? (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <p className="mt-1 text-right text-[11px] text-muted-foreground" aria-live="polite">
        {copied ? "Reference copied" : "\u00A0"}
      </p>

      <button
        type="button"
        onClick={() => onSimulate("success")}
        disabled={processing}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl brand-gradient-bg px-4 py-3 text-sm font-semibold text-white glow-purple transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.99] disabled:opacity-70"
      >
        {processing ? "Awaiting confirmation…" : "Simulate Demo Payment"}
      </button>

      <div className="mt-3 border-t border-white/10 pt-3">
        <p className="text-center text-[11px] uppercase tracking-widest text-muted-foreground">Try other demo outcomes</p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => onSimulate("failed")}
            disabled={processing}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-xs font-medium text-foreground/80 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
          >
            Payment failure
          </button>
          <button
            type="button"
            onClick={() => onSimulate("insufficient")}
            disabled={processing}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-xs font-medium text-foreground/80 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
          >
            Insufficient balance
          </button>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Simulation only. No transaction was submitted to the blockchain.
      </p>
    </>
  )
}

function ExpiredView({ descId, onRefresh }: { descId: string; onRefresh: () => void }) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-400/15">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2 2M9 2h6" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold">Payment request expired</h3>
      <p id={descId} className="mt-1 text-sm text-muted-foreground">
        This demo QR code timed out. Generate a fresh request to continue.
      </p>
      <button
        type="button"
        onClick={onRefresh}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl brand-gradient-bg px-4 py-3 text-sm font-semibold text-white glow-purple transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Refresh Payment Request
      </button>
    </div>
  )
}

function SuccessView({
  descId,
  usd,
  hzc,
  reference,
  copied,
  onCopy,
  onRestart,
}: {
  descId: string
  usd: string
  hzc: string
  reference: string
  copied: boolean
  onCopy: () => void
  onRestart: () => void
}) {
  return (
    <div className="py-2 text-center">
      <div
        className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400/15"
        style={{ animation: "horizon-pulse-ring 1.8s infinite" }}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold">Demo Payment Confirmed</h3>
      <p id={descId} className="mt-1 text-sm text-muted-foreground">
        {`$${usd} · ${hzc} HZC (demo token) received`}
      </p>

      <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
        <Row label="Status" value="Simulated" statusTone />
        <Row label="Settlement" value="Demo settlement preview" />
        <Row label="Network" value="Solana Preview" />
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">Reference</span>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs text-foreground/90 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Copy reference ${reference}`}
          >
            {reference}
            {copied ? (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Simulation only. No transaction was submitted to the blockchain.
      </p>

      <button
        type="button"
        onClick={onRestart}
        className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Start New Demo Transaction
      </button>
    </div>
  )
}

function FailureView({ descId, onRetry }: { descId: string; onRetry: () => void }) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-400/15">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-red-300" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold">Demo payment failed</h3>
      <p id={descId} className="mt-1 text-sm text-muted-foreground">
        The simulated payment could not be completed. No funds were moved. You can generate a new request and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl brand-gradient-bg px-4 py-3 text-sm font-semibold text-white glow-purple transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Try Again
      </button>
    </div>
  )
}

function InsufficientView({ descId, onRetry }: { descId: string; onRetry: () => void }) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-400/15">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold">Insufficient demo balance</h3>
      <p id={descId} className="mt-1 text-sm text-muted-foreground">
        The demo wallet does not hold enough HZC for this amount. Lower the amount or reset the demo request to continue.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl brand-gradient-bg px-4 py-3 text-sm font-semibold text-white glow-purple transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Reset Demo Request
      </button>
    </div>
  )
}

function Row({
  label,
  value,
  bold,
  statusTone,
}: {
  label: string
  value: string
  bold?: boolean
  statusTone?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`${bold ? "font-semibold text-foreground" : "text-foreground/90"} ${
          statusTone ? "inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-200" : ""
        }`}
      >
        {statusTone && <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" />}
        {value}
      </span>
    </div>
  )
}
