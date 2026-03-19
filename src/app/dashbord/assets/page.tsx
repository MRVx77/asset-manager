import {
  getCategoriesAction,
  getUserAssetAction,
} from "@/actions/dashbord-action";
import AssetGrid from "@/components/dashbord/asset-grid";
import UploadAsset from "@/components/dashbord/upload-asset";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function userAssetsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session === null) return null;

  const [categories, assets] = await Promise.all([
    getCategoriesAction(),
    getUserAssetAction(session?.user.id),
  ]);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Assets</h1>
            <p className="text-muted-foreground text-sm">
              Manage and upload your digital assets
            </p>
          </div>

          <UploadAsset categories={categories || []} />
        </div>

        {/* Grid (no background, no box) */}
        <AssetGrid assets={assets} />
      </div>
    </div>
  );
}

export default userAssetsPage;
