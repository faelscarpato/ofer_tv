"use client"

import { useState, useTransition } from "react"
import type { Offer } from "@/lib/db/schema"
import {
  createOffer,
  deleteOffer,
  duplicateOffer,
  setOfferStatus,
  updateOffer,
} from "@/app/actions/offers"
import { StudioHeader } from "./studio-header"
import { NavRail, type StudioView } from "./nav-rail"
import { EditorCanvas } from "./editor-canvas"
import { PropertiesPanel } from "./properties-panel"
import { QueueTable } from "./queue-table"
import { MediaLibrary } from "./media-library"

const MEDIA = [
  { name: "picanha.png", type: "imagem", url: "/produtos/picanha.png" },
  { name: "tomate.png", type: "imagem", url: "/produtos/tomate.png" },
  { name: "cerveja.png", type: "imagem", url: "/produtos/cerveja.png" },
  { name: "queijo.png", type: "imagem", url: "/produtos/queijo.png" },
] as const

export function Studio({ initialOffers }: { initialOffers: Offer[] }) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers)
  const [view, setView] = useState<StudioView>("editor")
  const [selectedId, setSelectedId] = useState<number | null>(
    initialOffers[0]?.id ?? null,
  )
  const [, startTransition] = useTransition()

  const selected = offers.find((o) => o.id === selectedId) ?? null

  function patchLocal(id: number, patch: Partial<Offer>) {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    )
  }

  function handleUpdate(id: number, patch: Partial<Offer>) {
    patchLocal(id, patch)
    startTransition(async () => {
      await updateOffer(id, patch as never)
    })
  }

  function handleCreate() {
    startTransition(async () => {
      const row = await createOffer({
        name: "Nova oferta",
        position: offers.length + 1,
      })
      if (row) {
        setOffers((prev) => [...prev, row as Offer])
        setSelectedId(row.id)
        setView("editor")
      }
    })
  }

  function handleDelete(id: number) {
    setOffers((prev) => prev.filter((o) => o.id !== id))
    if (selectedId === id) setSelectedId(null)
    startTransition(async () => {
      await deleteOffer(id)
    })
  }

  function handleDuplicate(id: number) {
    startTransition(async () => {
      const row = await duplicateOffer(id)
      if (row) setOffers((prev) => [...prev, row as Offer])
    })
  }

  function handleStatus(id: number, status: string) {
    patchLocal(id, { status })
    startTransition(async () => {
      await setOfferStatus(id, status)
    })
  }

  function handlePublishAll() {
    offers
      .filter((o) => o.status !== "published")
      .forEach((o) => handleStatus(o.id, "published"))
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-paper-50 text-ink-900">
      <StudioHeader
        selected={selected}
        onRename={(name) => selected && handleUpdate(selected.id, { name })}
        onPublish={handlePublishAll}
      />
      <div className="flex min-h-0 flex-1">
        <NavRail view={view} onChange={setView} />

        {view === "editor" && (
          <>
            <EditorCanvas offer={selected} />
            <PropertiesPanel
              offer={selected}
              media={MEDIA as unknown as { name: string; type: string; url: string }[]}
              onChange={(patch) =>
                selected && handleUpdate(selected.id, patch)
              }
            />
          </>
        )}

        {view === "queue" && (
          <QueueTable
            offers={offers}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id)
              setView("editor")
            }}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onStatus={handleStatus}
            onCreate={handleCreate}
          />
        )}

        {view === "library" && (
          <MediaLibrary
            media={MEDIA as unknown as { name: string; type: string; url: string }[]}
          />
        )}
      </div>
    </div>
  )
}
