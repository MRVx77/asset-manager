"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { asset, purchase } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createPaypalOrderAction(assetId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const [getAsset] = await db.select().from(asset).where(eq(asset.id, assetId));
  if (!getAsset) {
    throw new Error("Asset not found");
  }

  const existingPurchase = await db
    .select()
    .from(purchase)
    .where(
      and(eq(purchase.assetId, assetId), eq(purchase.userId, session.user.id)),
    )
    .limit(1);

  if (existingPurchase.length > 0) {
    return {
      alreadyPurchaseTrue: true,
    };
  }

  try {
  } catch (error) {
    console.log(error);
  }
}
