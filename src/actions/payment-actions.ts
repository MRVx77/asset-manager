"use server";

import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { asset, payment, purchase } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getPaypalAccessTokenAction() {
  const res = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
      ).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function createPaypalOrderAction(assetId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
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
    const accessToken = await getPaypalAccessTokenAction();
    const res = await fetch(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: assetId,
              description: `Purchase of ${getAsset.title}`,
              amount: {
                currency_code: "USD",
                value: "5.00",
              },
              custom_id: `${session.user.id}|${assetId}`,
            },
          ],
          application_context: {
            return_url: `${process.env.APP_URL}/api/paypal/capture?assetId=${assetId}`,
            cancel_url: `${process.env.APP_URL}/gallery/${assetId}?cancelled=true`,
          },
        }),
      },
    );

    const data = await res.json();
    if (data.id) {
      return {
        orderId: data.id,
        approvalLink: data.links.find((link: any) => link.rel === "approve")
          .href,
      };
    } else {
      throw new Error("Failed to create paypal order");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function recordPurchaseAction(
  assetId: string,
  paypalOrderId: string,
  userId: string,
  price = 5.0,
) {
  try {
    const existingPurchase = await db
      .select()
      .from(purchase)
      .where(and(eq(purchase.assetId, assetId), eq(purchase.userId, userId)))
      .limit(1);

    if (existingPurchase.length > 0) {
      return {
        success: true,
        alreadyExists: true,
      };
    }

    const paymentUuid = uuidv4();
    const purchaseUuid = uuidv4();

    await db.insert(payment).values({
      id: paymentUuid,
      amount: Math.round(price * 100),
      currency: "USD",
      status: "completed",
      provider: "paypal",
      providerId: paypalOrderId,
      userId: userId,
      createdAt: new Date(),
    });

    await db.insert(purchase).values({
      id: purchaseUuid,
      assetId,
      userId,
      paymentId: paymentUuid,
      price: Math.round(price * 100),
      createdAt: new Date(),
    });

    //create invoice

    revalidatePath(`gallery/${assetId}`);
    revalidatePath(`/dashbord/purchases`);

    return {
      success: true,
      purchaseId: purchaseUuid,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to save purchase info",
    };
  }
}

export async function hasUserPurchaseAction(assetId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return false;
  }

  try {
    const existingPurchase = await db
      .select()
      .from(purchase)
      .where(
        and(
          eq(purchase.assetId, assetId),
          eq(purchase.userId, session.user.id),
        ),
      )
      .limit(1);

    return existingPurchase.length > 0;
  } catch (e) {
    console.log(e);

    return false;
  }
}

export async function getAllUserPurchaseAssetsAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  try {
    const userPurchases = await db
      .select({ purchase: purchase, asset: asset })
      .from(purchase)
      .innerJoin(asset, eq(asset.id, purchase.assetId))
      .where(eq(purchase.userId, session.user.id))
      .orderBy(purchase.createdAt);

    return userPurchases;
  } catch (error) {
    console.log(error);
    return [];
  }
}
