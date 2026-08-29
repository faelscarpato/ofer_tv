import { getOffers } from "@/app/actions/offers"
import { Studio } from "@/components/studio/studio"

export const dynamic = "force-dynamic"

export default async function Page() {
  const offers = await getOffers()
  return <Studio initialOffers={offers} />
}
