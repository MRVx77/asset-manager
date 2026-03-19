"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { asset, category, purchase, user } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const AssetSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  categoryId: z.number().positive("please select a category"),
  fileUrl: z.string().url("Invalid files url"),
  thumbnailUrl: z.string().url("Invalid files url").optional(),
});

export async function getCategoriesAction() {
  try {
    return db.select().from(category);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function uploadAssetAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be login to upload asset");
  }

  try {
    const vaildateFields = AssetSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      categoryId: Number(formData.get("categoryId")),
      fileUrl: formData.get("fileUrl"),
      thumbnailUrl: formData.get("thumbnailUrl") || formData.get("fileUrl"),
    });

    await db.insert(asset).values({
      title: vaildateFields.title,
      description: vaildateFields.description,
      fileUrl: vaildateFields.fileUrl,
      thumbnailUrl: vaildateFields.fileUrl,
      isApproved: "pending",
      userId: session.user.id,
      categoryId: vaildateFields.categoryId,
    });

    revalidatePath("/dashbord/assets");
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to upload asset!",
    };
  }
}

export async function getUserAssetAction(userId: string) {
  try {
    return await db
      .select()
      .from(asset)
      .where(eq(asset.userId, userId))
      .orderBy(asset.createdAt);
  } catch (error) {
    console.log(error);

    return [];
  }
}

export async function getPublicAssetAction(categoryId?: number) {
  try {
    let condition = and(eq(asset.isApproved, "approved"));

    if (categoryId) {
      condition = and(condition, eq(asset.categoryId, categoryId));
    }

    const query = await db
      .select({
        asset: asset,
        categoryName: category.name,
        userName: user.name,
      })
      .from(asset)
      .leftJoin(category, eq(asset.categoryId, category.id))
      .leftJoin(user, eq(asset.userId, user.id))
      .where(condition);

    return query;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAssetByIdAction(assetId: string) {
  try {
    const [result] = await db
      .select({
        asset: asset,
        categoryName: category.name,
        userName: user.name,
        userImage: user.image,
        userId: user.id,
      })
      .from(asset)
      .leftJoin(category, eq(asset.categoryId, category.id))
      .leftJoin(user, eq(asset.userId, user.id))
      .where(eq(asset.id, assetId));

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteAssetAction(assteId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/gallery");
    }

    const assetExist = await db.query.asset.findFirst({
      where: eq(asset.id, assteId),
    });

    if (!assetExist) {
      throw new Error("Asset not found");
    }

    if (assetExist.userId !== session.user.id) {
      throw new Error("You are not allowed to delete this asset");
    }

    const purchaseExists = await db.query.purchase.findFirst({
      where: eq(purchase.assetId, assteId),
    });

    if (purchaseExists) {
      throw new Error(
        "This asset cannot be deleted because users have already purchased it",
      );
    }

    await db.delete(asset).where(eq(asset.id, assteId));

    revalidatePath("/dashbord/assets");
    revalidatePath("/gallery");

    return {
      success: true,
      message: "Asset deleted successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to deleted asset.",
    };
  }
}
