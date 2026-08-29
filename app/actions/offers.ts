"use server"

import { db } from "@/lib/db"
import { offers, type NewOffer } from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getOffers() {
  return db.select().from(offers).orderBy(asc(offers.position), asc(offers.id))
}

export async function getPublishedOffers() {
  return db
    .select()
    .from(offers)
    .where(eq(offers.status, "published"))
    .orderBy(asc(offers.position), asc(offers.id))
}

export async function createOffer(data: Partial<NewOffer>) {
  const [row] = await db
    .insert(offers)
    .values({
      name: data.name ?? "Nova oferta",
      category: data.category ?? "",
      priceFrom: data.priceFrom ?? null,
      priceTo: data.priceTo ?? "0",
      imageUrl: data.imageUrl ?? "",
      radioTrack: data.radioTrack ?? "",
      status: data.status ?? "draft",
      position: data.position ?? 0,
      duration: data.duration ?? 8,
    })
    .returning()
  revalidatePath("/")
  revalidatePath("/tv")
  return row
}

export async function updateOffer(id: number, data: Partial<NewOffer>) {
  const [row] = await db
    .update(offers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(offers.id, id))
    .returning()
  revalidatePath("/")
  revalidatePath("/tv")
  return row
}

export async function deleteOffer(id: number) {
  await db.delete(offers).where(eq(offers.id, id))
  revalidatePath("/")
  revalidatePath("/tv")
}

export async function duplicateOffer(id: number) {
  const [orig] = await db.select().from(offers).where(eq(offers.id, id))
  if (!orig) return
  const { id: _omit, createdAt: _c, updatedAt: _u, ...rest } = orig
  const [row] = await db
    .insert(offers)
    .values({ ...rest, name: `${orig.name} (cópia)`, status: "draft" })
    .returning()
  revalidatePath("/")
  return row
}

export async function setOfferStatus(id: number, status: string) {
  return updateOffer(id, { status })
}
