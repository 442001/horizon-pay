export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      role="status"
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200 sm:px-3 sm:text-xs ${className ?? ""}`}
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="whitespace-nowrap">
        <span className="font-bold">DEMO MODE</span>
        <span className="hidden text-amber-200/80 sm:inline"> — No real funds are moved</span>
      </span>
    </span>
  )
}
