// Decorative, deterministic QR-style matrix (visual only — not a scannable code).
function seededMatrix(seed: string, size: number) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const cells: boolean[] = []
  for (let i = 0; i < size * size; i++) {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    cells.push((h >>> 0) % 100 < 48)
  }
  return cells
}

function isFinder(r: number, c: number, size: number) {
  const inTL = r < 7 && c < 7
  const inTR = r < 7 && c >= size - 7
  const inBL = r >= size - 7 && c < 7
  return inTL || inTR || inBL
}

export function QrCode({ value, className }: { value: string; className?: string }) {
  const size = 25
  const cells = seededMatrix(value, size)

  return (
    <div className={`relative h-52 w-52 ${className ?? ""}`}>
      <div
        className="grid h-full w-full rounded-md bg-white p-3"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, gap: 0 }}
        role="img"
        aria-label="Payment QR code"
      >
        {cells.map((on, i) => {
          const r = Math.floor(i / size)
          const c = i % size
          if (isFinder(r, c, size)) return <span key={i} className="aspect-square" />
          return (
            <span
              key={i}
              className="aspect-square"
              style={{ background: on ? "#0b0a12" : "transparent" }}
            />
          )
        })}
      </div>
      <FinderOverlay size={size} />
    </div>
  )
}

// Render crisp finder patterns as overlay corners.
function FinderOverlay({ size }: { size: number }) {
  const positions = [
    { top: 12, left: 12 },
    { top: 12, right: 12 },
    { bottom: 12, left: 12 },
  ]
  return (
    <>
      {positions.map((pos, i) => (
        <span
          key={i}
          className="pointer-events-none absolute h-[19%] w-[19%] rounded-[6px] border-[5px] border-[#0b0a12]"
          style={pos as React.CSSProperties}
        >
          <span className="absolute inset-[22%] rounded-[2px] bg-[#0b0a12]" />
        </span>
      ))}
    </>
  )
}
