import { getAssetByIdAction } from "@/actions/dashbord-action";
import { hasUserPurchaseAction } from "@/actions/payment-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const hasPurchase = await hasUserPurchaseAction(id);

    if (!hasPurchase) {
      return NextResponse.redirect(new URL(`/gallery/${id}`, request.url));
    }

    const result = await getAssetByIdAction(id);

    if (!result) {
      return NextResponse.redirect(new URL("/gallery", request.url));
    }
    return NextResponse.redirect(new URL(result.asset.fileUrl));
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/gallery", request.url));
  }
}
