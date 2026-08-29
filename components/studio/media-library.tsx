"use client"

import Image from "next/image"
import { ImagePlus, Upload } from "lucide-react"

type Media = { name: string; type: string; url: string }

export function MediaLibrary({ media }: { media: Media[] }) {
  return (
    <section className="min-w-0 flex-1 overflow-y-auto bg-paper-50">
      <div className="mx-auto max-w-4xl px-8 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">
              Biblioteca de mídia
            </h1>
            <p className="mt-1 text-sm text-warmgray-600">
              {media.length} arquivos disponíveis
            </p>
          </div>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-sm bg-accent-600 px-4 text-sm font-semibold text-paper-50 transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
          >
            <Upload className="h-4 w-4" strokeWidth={2} />
            Fazer upload
          </button>
        </div>

        {media.length === 0 ? (
          <EmptyLibrary />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {media.map((m) => (
              <div
                key={m.url}
                className="group relative aspect-square overflow-hidden rounded-md bg-ink-800 shadow-low"
              >
                <Image
                  src={m.url || "/placeholder.svg"}
                  alt={m.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink-900/70 to-transparent p-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-xs text-paper-50">
                      {m.name}
                    </span>
                    <span className="shrink-0 rounded-full bg-paper-50/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-paper-50 backdrop-blur-sm">
                      {m.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function EmptyLibrary() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-ink-900/12 bg-white py-20">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-100 text-warmgray-400">
        <ImagePlus className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-ink-900">
          Biblioteca vazia
        </h3>
        <p className="mt-1 max-w-xs text-sm text-warmgray-600">
          Adicione fotos de produtos, vídeos e áudios para usar nos seus
          cartazes.
        </p>
      </div>
      <button
        type="button"
        className="flex h-9 items-center gap-2 rounded-sm bg-accent-600 px-4 text-sm font-semibold text-paper-50 transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
      >
        <Upload className="h-4 w-4" strokeWidth={2} />
        Fazer upload da primeira mídia
      </button>
    </div>
  )
}
