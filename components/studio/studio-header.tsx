"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Tv } from "lucide-react"
import type { Offer } from "@/lib/db/schema"

export function StudioHeader({
  selected,
  onRename,
  onPublish,
}: {
  selected: Offer | null
  onRename: (name: string) => void
  onPublish: () => void
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const value = draft ?? selected?.name ?? "OferTV Studio"

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-ink-900/8 bg-paper-50 pl-4 pr-3">
      <div className="flex items-center gap-3">
        <span className="font-display text-sm font-bold tracking-tight text-accent-600">
          OferTV
        </span>
        <span className="h-4 w-px bg-ink-900/10" />
        <input
          value={value}
          disabled={!selected}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (selected && draft != null && draft !== selected.name) {
              onRename(draft.trim() || "Sem título")
            }
            setDraft(null)
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return
            if (e.key === "Enter") (e.target as HTMLInputElement).blur()
          }}
          className="w-56 rounded-sm border border-transparent bg-transparent px-1.5 py-1 text-sm font-medium text-ink-900 outline-none transition-colors hover:border-ink-900/10 focus:border-accent-500 disabled:text-warmgray-400"
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-xs font-medium text-warmgray-600">
          <Check className="h-3.5 w-3.5" strokeWidth={2} />
          Salvo
        </span>
        <Link
          href="/tv"
          target="_blank"
          className="rounded-sm px-3 py-1.5 text-xs font-medium text-warmgray-600 transition-colors hover:bg-paper-100 hover:text-ink-900"
        >
          Ver TV
        </Link>
        <button
          type="button"
          onClick={onPublish}
          className="flex h-9 items-center gap-2 rounded-sm bg-accent-600 px-4 text-sm font-semibold text-paper-50 transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
        >
          <Tv className="h-4 w-4" strokeWidth={2} />
          Publicar na TV
        </button>
      </div>
    </header>
  )
}
