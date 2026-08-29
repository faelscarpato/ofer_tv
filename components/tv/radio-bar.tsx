"use client"

export function RadioBar({ track }: { track: string }) {
  const label = track || "Rádio Indoor — OferTV"
  const bars = [0, 1, 2, 3]

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-3 bg-ink-900/60 px-5 backdrop-blur-sm">
      {/* equalizador */}
      <div className="flex h-4 items-end gap-[3px]" aria-hidden>
        {bars.map((b) => (
          <span
            key={b}
            className="w-[3px] origin-bottom rounded-full bg-accent-600/60"
            style={{
              height: "100%",
              animation: "eq 0.9s ease-in-out infinite alternate",
              animationDelay: `${b * 0.14}s`,
            }}
          />
        ))}
      </div>

      {/* faixa com marquee se longo */}
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="flex whitespace-nowrap font-mono text-xs text-paper-50/80">
          <span className="animate-[marquee_18s_linear_infinite] pr-16">
            Tocando agora — {label}
          </span>
          <span
            className="animate-[marquee_18s_linear_infinite] pr-16"
            aria-hidden
          >
            Tocando agora — {label}
          </span>
        </div>
      </div>

      <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-accent-500/80">
        ao vivo
      </span>
    </div>
  )
}
