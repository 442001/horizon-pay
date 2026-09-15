"use client"

import { useState } from "react"
import { HorizonLogo } from "./logo"

function truncate(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`
}

export function Navbar() {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [address] = useState("7xKp9QeYfHZc4rDn8vTmLwGh2bAqU3sJ")

  function handleConnect() {
    if (connected) {
      setConnected(false)
      return
    }
    setConnecting(true)
    setTimeout(() => {
      setConnecting(false)
      setConnected(true)
    }, 1100)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <HorizonLogo />

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300 sm:inline-flex">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              style={{ animation: "horizon-pulse-ring 2s infinite" }}
            />
            Solana Mainnet Ready
          </span>

          <button
            type="button"
            onClick={handleConnect}
            aria-busy={connecting}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-[0.98] ${
              connected
                ? "border border-white/15 bg-white/5 text-foreground hover:bg-white/10"
                : "brand-gradient-bg text-white glow-purple hover:brightness-110"
            }`}
          >
            {connected ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {truncate(address)}
              </>
            ) : connecting ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Connecting…
              </>
            ) : (
              <>
                <PhantomMark />
                <span className="hidden sm:inline">Connect Phantom Wallet</span>
                <span className="sm:hidden">Connect</span>
              </>
            )}
          </button>
        </div>
      </div>
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
