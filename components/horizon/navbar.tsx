"use client"

import { useEffect, useRef, useState } from "react"
import { HorizonLogo } from "./logo"
import { DemoBadge } from "./demo-badge"
import { useWallet, truncateAddress } from "./wallet-context"

export function Navbar() {
  const { status, address, network, connect, disconnect, dismissNotDetected } = useWallet()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("mousedown", onClick)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("mousedown", onClick)
      window.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  const connecting = status === "connecting"
  const connected = status === "connected"

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <HorizonLogo />
          <DemoBadge />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200 md:inline-flex">
            <span
              className="h-1.5 w-1.5 rounded-full bg-cyan-300"
              style={{ animation: "horizon-pulse-ring 2s infinite" }}
            />
            {network}
          </span>

          {connected ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-foreground transition-all hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] sm:px-4"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                <span className="font-mono">{truncateAddress(address ?? "")}</span>
                <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 glass p-4 shadow-2xl"
                >
                  <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Connection</p>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                    <span className="font-semibold text-emerald-300">Connected</span>
                  </div>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">Address</dt>
                      <dd className="font-mono text-foreground/90">{truncateAddress(address ?? "")}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">Network</dt>
                      <dd className="text-foreground/90">{network}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => {
                      disconnect()
                      setMenuOpen(false)
                    }}
                    className="mt-4 w-full rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm font-semibold text-red-200 transition-colors hover:bg-red-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={connect}
              disabled={connecting}
              aria-busy={connecting}
              className="inline-flex items-center gap-2 rounded-xl brand-gradient-bg px-4 py-2 text-sm font-semibold text-white glow-purple transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
            >
              {connecting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                  Connecting...
                </>
              ) : (
                <>
                  <PhantomMark />
                  <span className="hidden sm:inline">Connect Phantom Wallet</span>
                  <span className="sm:hidden">Connect</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {status === "not-detected" && (
        <div className="border-t border-amber-400/20 bg-amber-400/[0.08]">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="flex items-start gap-2 text-amber-100">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Phantom Wallet was not detected. Install Phantom or continue in Demo Mode.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://phantom.app/download"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-100 transition-colors hover:bg-amber-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                Install Phantom
              </a>
              <button
                type="button"
                onClick={dismissNotDetected}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Continue in Demo Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function PhantomMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-9 9c0 .6.4 1 1 1h4a2 2 0 0 1 4 0 2 2 0 0 0 2 2h4a3 3 0 0 0 3-3 9 9 0 0 0-9-9Zm-3.2 8.2a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Zm4 0a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z" />
    </svg>
  )
}
