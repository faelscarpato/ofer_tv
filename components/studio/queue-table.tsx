"use client"

import { Copy, Pencil, Plus, Trash2 } from "lucide-react"
import type { Offer } from "@/lib/db/schema"
import { formatBRL, relativeTime } from "@/lib/format"
import { cn } from "@/lib/utils"

export function QueueTable({
  offers,
  selectedId,
  onSelect,
  onDelete,
  onDuplicate,
  onStatus,
  onCreate,
}: {
  offers: Offer[]
  selectedId: number | null
  onSelect: (id: number) => void
  onDelete: (id: number) => void
  onDuplicate: (id: number) => void
  onStatus: (id: number, status: string) => void
  onCreate: () => void
}) {
  return (
    <section className="min-w-0 flex-1 overflow-y-auto bg-paper-50">
      <div className="mx-auto max-w-4xl px-8 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">
              Fila de cartazes
            </h1>
            <p className="mt-1 text-sm text-warmgray-600">
              {offers.filter((o) => o.status === "published").length} publicados
              de {offers.length} no total
            </p>
          </div>
          <button
            type="button"
            onClick={onCreate}
            className="flex h-9 items-center gap-2 rounded-sm bg-accent-600 px-4 text-sm font-semibold text-paper-50 transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Novo cartaz
          </button>
        </div>

        {offers.length === 0 ? (
          <EmptyQueue onCreate={onCreate} />
        ) : (
          <div className="overflow-hidden rounded-md border border-ink-900/8 bg-white">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-ink-900/8">
                  <Th className="w-8 pl-4">#</Th>
                  <Th>Cartaz</Th>
                  <Th>Status</Th>
                  <Th>Preço</Th>
                  <Th>Última edição</Th>
                  <Th className="w-28 pr-4 text-right">Ações</Th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o, i) => {
                  const active = o.id === selectedId
                  return (
                    <tr
                      key={o.id}
                      className={cn(
                        "group h-12 cursor-pointer border-b border-ink-900/6 transition-colors last:border-0",
                        active ? "bg-accent-600/6" : "hover:bg-paper-100",
                      )}
                      onClick={() => onSelect(o.id)}
                    >
                      <td className="pl-4 font-mono text-xs tabular-nums text-warmgray-400">
                        {i + 1}
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 shrink-0 rounded-md bg-cover bg-center ring-1 ring-ink-900/8"
                            style={{
                              backgroundImage: o.imageUrl
                                ? `url(${o.imageUrl})`
                                : undefined,
                            }}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink-900">
                              {o.name}
                            </p>
                            <p className="truncate text-xs text-warmgray-600">
                              {o.category || "Sem categoria"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="pr-3">
                        <StatusBadge
                          status={o.status}
                          onToggle={(e) => {
                            e.stopPropagation()
                            onStatus(
                              o.id,
                              o.status === "published" ? "draft" : "published",
                            )
                          }}
                        />
                      </td>
                      <td className="pr-3 text-sm font-medium tabular-nums text-ink-900">
                        {formatBRL(o.priceTo)}
                      </td>
                      <td className="pr-3 font-mono text-xs tabular-nums text-warmgray-600">
                        {relativeTime(o.updatedAt)}
                      </td>
                      <td className="pr-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                          <RowAction
                            label="Editar"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelect(o.id)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </RowAction>
                          <RowAction
                            label="Duplicar"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDuplicate(o.id)
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </RowAction>
                          <RowAction
                            label="Excluir"
                            danger
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(o.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </RowAction>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={cn(
        "h-10 px-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-warmgray-600",
        className,
      )}
    >
      {children}
    </th>
  )
}

function StatusBadge({
  status,
  onToggle,
}: {
  status: string
  onToggle: (e: React.MouseEvent) => void
}) {
  const published = status === "published"
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        published
          ? "bg-success-600/12 text-success-600"
          : "bg-paper-200 text-warmgray-600 hover:bg-paper-100",
      )}
    >
      {published ? "Publicado" : "Rascunho"}
    </button>
  )
}

function RowAction({
  children,
  label,
  danger,
  onClick,
}: {
  children: React.ReactNode
  label: string
  danger?: boolean
  onClick: (e: React.MouseEvent) => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-sm text-warmgray-600 transition-colors",
        danger ? "hover:bg-error-600/10 hover:text-error-600" : "hover:bg-paper-200 hover:text-ink-900",
      )}
    >
      {children}
    </button>
  )
}

function EmptyQueue({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-ink-900/12 bg-white py-20">
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        aria-hidden
        className="text-warmgray-400"
      >
        <rect
          x="10"
          y="18"
          width="52"
          height="34"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M28 58h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M22 40l8-9 6 6 6-8 8 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="44" cy="28" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-ink-900">
          Nenhum cartaz na fila
        </h3>
        <p className="mt-1 max-w-xs text-sm text-warmgray-600">
          Crie seu primeiro cartaz promocional para começar a exibir na TV da
          loja.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="flex h-9 items-center gap-2 rounded-sm bg-accent-600 px-4 text-sm font-semibold text-paper-50 transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Criar primeiro cartaz
      </button>
    </div>
  )
}
