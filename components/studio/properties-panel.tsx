"use client"

import Image from "next/image"
import { MousePointerClick } from "lucide-react"
import type { Offer } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

type Media = { name: string; type: string; url: string }

export function PropertiesPanel({
  offer,
  media,
  onChange,
}: {
  offer: Offer | null
  media: Media[]
  onChange: (patch: Partial<Offer>) => void
}) {
  if (!offer) {
    return (
      <aside className="flex w-[280px] shrink-0 flex-col items-center justify-center gap-3 border-l border-ink-900/8 bg-paper-50 px-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-paper-100 text-warmgray-400">
          <MousePointerClick className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <p className="text-sm text-warmgray-600">
          Selecione um elemento para editar suas propriedades.
        </p>
      </aside>
    )
  }

  return (
    <aside className="flex w-[280px] shrink-0 flex-col overflow-y-auto border-l border-ink-900/8 bg-paper-50">
      <div className="border-b border-ink-900/8 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-warmgray-600">
          Propriedades
        </p>
      </div>

      <div className="flex flex-col gap-5 px-4 py-5">
        <Field label="Nome do produto">
          <input
            value={offer.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full rounded-sm border border-ink-900/10 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition-colors focus:border-accent-500"
          />
        </Field>

        <Field label="Categoria">
          <input
            value={offer.category}
            onChange={(e) => onChange({ category: e.target.value })}
            placeholder="Açougue, Hortifruti…"
            className="w-full rounded-sm border border-ink-900/10 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition-colors placeholder:text-warmgray-400 focus:border-accent-500"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Preço de">
            <PriceInput
              value={offer.priceFrom}
              onChange={(v) => onChange({ priceFrom: v as never })}
            />
          </Field>
          <Field label="Preço por">
            <PriceInput
              value={offer.priceTo}
              onChange={(v) => onChange({ priceTo: v as never })}
            />
          </Field>
        </div>

        <Field label="Imagem do produto">
          <div className="grid grid-cols-4 gap-2">
            {media.map((m) => {
              const active = offer.imageUrl === m.url
              return (
                <button
                  key={m.url}
                  type="button"
                  onClick={() => onChange({ imageUrl: m.url })}
                  aria-label={`Usar ${m.name}`}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md ring-2 transition-all",
                    active
                      ? "ring-accent-600"
                      : "ring-transparent hover:ring-ink-900/15",
                  )}
                >
                  <Image
                    src={m.url || "/placeholder.svg"}
                    alt={m.name}
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </button>
              )
            })}
          </div>
        </Field>

        <Field label="Faixa de rádio (rodapé)">
          <input
            value={offer.radioTrack}
            onChange={(e) => onChange({ radioTrack: e.target.value })}
            placeholder="Nome da faixa"
            className="w-full rounded-sm border border-ink-900/10 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition-colors placeholder:text-warmgray-400 focus:border-accent-500"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Duração (s)">
            <input
              type="number"
              min={3}
              max={30}
              value={offer.duration}
              onChange={(e) =>
                onChange({ duration: Number(e.target.value) || 8 })
              }
              className="w-full rounded-sm border border-ink-900/10 bg-white px-3 py-2 text-sm tabular-nums text-ink-900 outline-none transition-colors focus:border-accent-500"
            />
          </Field>
          <Field label="Status">
            <div className="flex h-[38px] items-center">
              <StatusToggle
                status={offer.status}
                onChange={(s) => onChange({ status: s })}
              />
            </div>
          </Field>
        </div>
      </div>
    </aside>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-warmgray-600">{label}</span>
      {children}
    </label>
  )
}

function PriceInput({
  value,
  onChange,
}: {
  value: string | number | null
  onChange: (v: string) => void
}) {
  const display = value == null || value === "" ? "" : String(value)
  return (
    <div className="flex items-center rounded-sm border border-ink-900/10 bg-white pl-3 transition-colors focus-within:border-accent-500">
      <span className="text-xs text-warmgray-400">R$</span>
      <input
        type="number"
        step="0.01"
        min={0}
        value={display}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent px-2 py-2 text-sm tabular-nums text-ink-900 outline-none"
      />
    </div>
  )
}

function StatusToggle({
  status,
  onChange,
}: {
  status: string
  onChange: (s: string) => void
}) {
  const published = status === "published"
  return (
    <button
      type="button"
      onClick={() => onChange(published ? "draft" : "published")}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
        published
          ? "bg-success-600/12 text-success-600"
          : "bg-paper-200 text-warmgray-600",
      )}
    >
      {published ? "Publicado" : "Rascunho"}
    </button>
  )
}
