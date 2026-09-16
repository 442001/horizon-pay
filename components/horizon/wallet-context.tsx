"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

export type WalletStatus = "disconnected" | "connecting" | "connected" | "not-detected"

const DEMO_ADDRESS = "7xKpQeYfHZc4rDn8vTmLwGh2bAqU3sJ3F21"
export const DEMO_NETWORK = "Solana Preview"

export function truncateAddress(addr: string) {
  return `${addr.slice(0, 3)}...${addr.slice(-4)}`
}

type WalletContextValue = {
  status: WalletStatus
  address: string | null
  network: string
  connect: () => void
  disconnect: () => void
  dismissNotDetected: () => void
}

const WalletContext = createContext<WalletContextValue | null>(null)

function detectPhantom() {
  if (typeof window === "undefined") return false
  // Phantom injects window.solana with isPhantom === true
  return Boolean((window as unknown as { solana?: { isPhantom?: boolean } }).solana?.isPhantom)
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<WalletStatus>("disconnected")
  const [address, setAddress] = useState<string | null>(null)

  const connect = useCallback(() => {
    if (!detectPhantom()) {
      setStatus("not-detected")
      return
    }
    setStatus("connecting")
    window.setTimeout(() => {
      setAddress(DEMO_ADDRESS)
      setStatus("connected")
    }, 1100)
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setStatus("disconnected")
  }, [])

  const dismissNotDetected = useCallback(() => {
    setStatus("disconnected")
  }, [])

  const value = useMemo<WalletContextValue>(
    () => ({ status, address, network: DEMO_NETWORK, connect, disconnect, dismissNotDetected }),
    [status, address, connect, disconnect, dismissNotDetected],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error("useWallet must be used within a WalletProvider")
  return ctx
}
