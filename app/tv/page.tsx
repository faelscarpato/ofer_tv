import { getPublishedOffers } from "@/app/actions/offers"
import { TvPlayer } from "@/components/tv/tv-player"

export const dynamic = "force-dynamic"

export default async function TvPage() {
  const offers = await getPublishedOffers()
  return <TvPlayer offers={offers} />
}
