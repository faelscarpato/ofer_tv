export function formatBRL(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number.parseFloat(value) : value
  if (n == null || Number.isNaN(n)) return "—"
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  })
}

export function priceParts(value: number | string | null | undefined) {
  const formatted = formatBRL(value)
  // separa "R$ 49,90" -> símbolo + número
  const match = formatted.match(/^(\D+)\s?(.+)$/)
  if (!match) return { symbol: "R$", amount: formatted }
  return { symbol: match[1].trim(), amount: match[2].trim() }
}

export function relativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return "agora"
  if (min < 60) return `${min} min atrás`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} h atrás`
  const days = Math.floor(h / 24)
  return `${days} d atrás`
}
