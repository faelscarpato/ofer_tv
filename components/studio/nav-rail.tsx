"use client"

import { LayoutTemplate, Images, ListOrdered } from "lucide-react"
import { cn } from "@/lib/utils"

export type StudioView = "editor" | "queue" | "library"

const items: { key: StudioView; icon: typeof LayoutTemplate; label: string }[] = [
  { key: "editor", icon: LayoutTemplate, label: "Editor" },
  { key: "queue", icon: ListOrdered, label: "Fila de cartazes" },
  { key: "library", icon: Images, label: "Biblioteca de mídia" },
]

export function NavRail({
  view,
  onChange,
}: {
  view: StudioView
  onChange: (v: StudioView) => void
}) {
  return (
    <nav className="flex w-16 shrink-0 flex-col items-center gap-2 border-r border-ink-900/8 bg-paper-50 py-4">
      {items.map(({ key, icon: Icon, label }) => {
        const active = view === key
        return (
          <div key={key} className="group relative">
            <button
              type="button"
              onClick={() => onChange(key)}
              aria-label={label}
              aria-pressed={active}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-md transition-colors duration-150",
                active
                  ? "bg-paper-200 text-ink-900"
                  : "text-warmgray-600 hover:bg-paper-100 hover:text-ink-900",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-14 top-1/2 z-20 -translate-y-1/2 whitespace-nowrap rounded-md bg-ink-900 px-2.5 py-1 text-xs font-medium text-paper-50 opacity-0 shadow-mid transition-opacity delay-150 duration-150 group-hover:opacity-100"
            >
              {label}
            </span>
          </div>
        )
      })}
    </nav>
  )
}
