import Image from "next/image"
import type { Offer } from "@/lib/db/schema"
import { priceParts } from "@/lib/format"
import { cn } from "@/lib/utils"

export function PosterPreview({
  offer,
  className,
}: {
  offer: Offer
  className?: string
}) {
  const to = priceParts(offer.priceTo)
  const hasFrom =
    offer.priceFrom != null && Number.parseFloat(String(offer.priceFrom)) > 0

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-ink-900 text-paper-50 [container-type:size]",
        className,
      )}
    >
      {offer.imageUrl ? (
        <Image
          src={offer.imageUrl || "/placeholder.svg"}
          alt={offer.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-ink-800 text-xs text-warmgray-400">
          Sem imagem
        </div>
      )}

      {/* gradiente de legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/25 to-transparent" />

      {/* conteúdo */}
      <div className="absolute inset-0 flex flex-col justify-end p-[6%]">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            {offer.category && (
              <p className="mb-[2%] text-[2.6cqw] font-medium uppercase tracking-[0.14em] text-paper-50/70">
                {offer.category}
              </p>
            )}
            <h2 className="font-display text-[7cqw] font-bold leading-[0.95] text-balance text-paper-50">
              {offer.name}
            </h2>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-[3%]">
            {hasFrom && (
              <span className="text-[3.2cqw] font-medium text-paper-50/60 line-through tabular-nums">
                de {priceParts(offer.priceFrom).symbol}{" "}
                {priceParts(offer.priceFrom).amount}
              </span>
            )}
            <div className="flex items-baseline gap-[0.4ch] rounded-full bg-accent-600 px-[5%] py-[2.5%] font-display font-bold text-white shadow-[0_0_0_1px_rgba(255,74,46,0.4)]">
              <span className="text-[3.4cqw]">{to.symbol}</span>
              <span className="text-[9cqw] leading-none tabular-nums">
                {to.amount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
