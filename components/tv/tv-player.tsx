"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { Offer } from "@/lib/db/schema"
import { priceParts } from "@/lib/format"
import { RadioBar } from "./radio-bar"

export function TvPlayer({ offers }: { offers: Offer[] }) {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)

  const current = offers[index]
  const duration = (current?.duration ?? 8) * 1000

  useEffect(() => {
    if (offers.length <= 1) return
    setProgress(0)
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const pct = Math.min(1, elapsed / duration)
      setProgress(pct)
      if (pct >= 1) {
        setIndex((i) => (i + 1) % offers.length)
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [index, offers.length, duration])

  if (offers.length === 0) {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-ink-900 text-paper-50">
        <div className="text-center">
          <p className="font-display text-3xl font-bold text-accent-500">
            OferTV
          </p>
          <p className="mt-2 text-sm text-paper-50/60">
            Nenhuma oferta publicada. Publique cartazes no estúdio.
          </p>
        </div>
      </main>
    )
  }

  const to = priceParts(current.priceTo)
  const hasFrom =
    current.priceFrom != null &&
    Number.parseFloat(String(current.priceFrom)) > 0
  const toDigits = to.amount.split("")

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-ink-900 text-paper-50">
      {/* barra de progresso do slide */}
      <div className="absolute inset-x-0 top-0 z-30 h-0.5 bg-paper-50/15">
        <div
          className="h-full bg-accent-600"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* imagem + ken burns (key força remount por slide) */}
      <div key={current.id} className="absolute inset-0">
        {current.imageUrl ? (
          <Image
            src={current.imageUrl || "/placeholder.svg"}
            alt={current.name}
            fill
            sizes="100vw"
            priority
            className="animate-kenburns object-cover"
          />
        ) : (
          <div className="h-full w-full bg-ink-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent" />
        {/* vinheta sutil */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(20,17,14,0.55) 100%)",
          }}
        />
      </div>

      {/* conteúdo do slide */}
      <div
        key={`content-${current.id}`}
        className="absolute inset-0 flex flex-col justify-end px-[5vw] pb-20 pt-12"
      >
        <div className="flex items-end justify-between gap-8">
          <div className="min-w-0 max-w-[55%] animate-badge-in">
            {current.category && (
              <p className="mb-3 text-lg font-medium uppercase tracking-[0.18em] text-paper-50/70">
                {current.category}
              </p>
            )}
            <h1 className="font-display text-6xl font-bold leading-[0.95] text-balance text-paper-50 lg:text-7xl xl:text-8xl">
              {current.name}
            </h1>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3">
            {hasFrom && (
              <span className="animate-badge-in text-2xl font-medium text-paper-50/60 line-through tabular-nums lg:text-3xl">
                de {priceParts(current.priceFrom).symbol}{" "}
                {priceParts(current.priceFrom).amount}
              </span>
            )}
            <div className="flex items-baseline gap-2 rounded-full bg-accent-600 px-8 py-4 font-display font-bold text-white">
              <span className="text-3xl lg:text-4xl">{to.symbol}</span>
              <span className="flex items-baseline text-7xl tabular-nums lg:text-8xl xl:text-9xl">
                {toDigits.map((d, i) => (
                  <span
                    key={`${current.id}-${i}`}
                    className="animate-badge-in inline-block"
                    style={{ animationDelay: `${300 + i * 60}ms` }}
                  >
                    {d}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <RadioBar track={current.radioTrack} />
    </main>
  )
}
