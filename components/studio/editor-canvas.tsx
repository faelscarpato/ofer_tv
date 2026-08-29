"use client"

import { useState } from "react"
import {
  Maximize2,
  Minus,
  Plus,
  RectangleHorizontal,
  RectangleVertical,
} from "lucide-react"
import type { Offer } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import { PosterPreview } from "./poster-preview"

export function EditorCanvas({ offer }: { offer: Offer | null }) {
  const [ratio, setRatio] = useState<"16:9" | "9:16">("16:9")
  const [zoom, setZoom] = useState(1)

  return (
    <section className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-paper-100/60 p-8">
      {/* grade sutil de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(20,17,14,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {offer ? (
        <div
          className="relative shadow-mid transition-transform duration-150"
          style={{
            transform: `scale(${zoom})`,
            width: ratio === "16:9" ? "min(72vh * 16/9, 90%)" : "auto",
            height: ratio === "16:9" ? "auto" : "min(72vh, 80%)",
            aspectRatio: ratio === "16:9" ? "16 / 9" : "9 / 16",
            maxHeight: "78%",
          }}
        >
          <PosterPreview offer={offer} className="h-full w-full" />
        </div>
      ) : (
        <p className="relative z-10 text-sm text-warmgray-600">
          Selecione um cartaz na fila para editar.
        </p>
      )}

      {/* toolbar flutuante */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-paper-50 p-1.5 shadow-mid">
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            label="16:9"
            active={ratio === "16:9"}
            onClick={() => setRatio("16:9")}
          >
            <RectangleHorizontal className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="9:16"
            active={ratio === "9:16"}
            onClick={() => setRatio("9:16")}
          >
            <RectangleVertical className="h-4 w-4" />
          </ToolbarButton>
        </div>
        <span className="mx-1 h-5 w-px bg-ink-900/8" />
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            label="Diminuir zoom"
            onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
          <span className="w-11 text-center font-mono text-xs tabular-nums text-warmgray-600">
            {Math.round(zoom * 100)}%
          </span>
          <ToolbarButton
            label="Aumentar zoom"
            onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(2)))}
          >
            <Plus className="h-4 w-4" />
          </ToolbarButton>
        </div>
        <span className="mx-1 h-5 w-px bg-ink-900/8" />
        <ToolbarButton label="Ajustar à tela" onClick={() => setZoom(1)}>
          <Maximize2 className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </section>
  )
}

function ToolbarButton({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150",
        active
          ? "bg-accent-600/12 text-accent-600"
          : "text-warmgray-600 hover:bg-paper-100 hover:text-ink-900",
      )}
    >
      {children}
    </button>
  )
}
