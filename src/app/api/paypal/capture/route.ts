import {
  getPaypalAccessTokenAction,
  recordPurchaseAction,
} from "@/actions/payment-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const assetId = searchParams.get("assetId");
  const payerId = searchParams.get("PayerID");

  const accessToken = await getPaypalAccessTokenAction();

  if (!token || !assetId) {
    redirect("/gallery");
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const response = await fetch(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();
    console.log(data, "payapl-capture");

    if (data.status === "COMPLETED") {
      //store purchase to db
      const saveToDB = await recordPurchaseAction(
        assetId,
        token,
        session.user.id,
        5.0,
      );
      if (!saveToDB.success) {
        return NextResponse.redirect(
          new URL(`/gallery/${assetId}?error=record_failed`, request.url),
        );
      }
      return NextResponse.redirect(
        new URL(`/gallery/${assetId}?success=true`, request.url),
      );
    } else {
      return NextResponse.redirect(
        new URL(`/gallery/${assetId}?error=payment-failed`, request.url),
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(
      new URL(`/gallery/${assetId}?error=server-error`, request.url),
    );
  }
}
