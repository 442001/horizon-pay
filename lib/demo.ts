export const HZC_PER_USD = 4.7382 // demo exchange rate: 1 USD ≈ 4.7382 HZC
export const SOL_PER_USD = 0.00553 // demo exchange rate: 1 USD ≈ 0.00553 SOL

export const MAX_DEMO_PAYMENT = 10000
export const DEMO_BALANCE_HZC = 25000 // simulated merchant/customer demo balance

const HEX = "0123456789ABCDEF"

export function generateReference(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  let suffix = ""
  for (let i = 0; i < 4; i++) suffix += HEX[Math.floor(Math.random() * 16)]
  return `HZP-${num}-${suffix}`
}

export type AmountValidation =
  | { ok: true; value: number }
  | { ok: false; message: string }

export function validateAmount(raw: string): AmountValidation {
  const trimmed = raw.trim()
  if (trimmed === "" || trimmed === ".") {
    return { ok: false, message: "Enter an amount greater than $0." }
  }
  const value = Number(trimmed)
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    return { ok: false, message: "Please enter a valid amount." }
  }
  if (value <= 0) {
    return { ok: false, message: "Enter an amount greater than $0." }
  }
  if (value > MAX_DEMO_PAYMENT) {
    return { ok: false, message: `The maximum demo payment is $${MAX_DEMO_PAYMENT.toLocaleString("en-US")}.` }
  }
  return { ok: true, value }
}

export function formatHzc(usd: number): string {
  return (usd * HZC_PER_USD).toLocaleString("en-US", { maximumFractionDigits: 2 })
}

export function formatSol(usd: number): string {
  return (usd * SOL_PER_USD).toLocaleString("en-US", { maximumFractionDigits: 4 })
}
