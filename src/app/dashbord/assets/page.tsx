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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              My Assets
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage and track your uploaded assets
            </p>
          </div>

          <UploadAsset categories={categories || []} />
        </div>

        {/* Content */}
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border rounded-2xl shadow-sm">
            <p className="text-lg font-semibold text-slate-700">
              No assets uploaded yet
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Start by uploading your first asset 🚀
            </p>
          </div>
        ) : (
          <div className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6">
            <AssetGrid assets={assets} />
          </div>
        )}
      </div>
    </div>
  );
}

export default userAssetsPage;
