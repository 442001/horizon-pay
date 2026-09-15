export function HorizonLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2.5">
        <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl brand-gradient-bg">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" aria-hidden="true">
            <path
              d="M3 15c3-4 6-4 9 0s6 4 9 0"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="7" r="2.4" fill="currentColor" />
          </svg>
        </span>
        <span className="text-lg font-semibold tracking-tight">
          Horizon
        </span>
      </div>
    </div>
  )
}
