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
  console.log(assets);

  return (
    <div className="container py-6">
      <div className=" flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold "> My Assets</h1>
        <UploadAsset categories={categories || []} />
      </div>
      <AssetGrid />
    </div>
  );
}

export default userAssetsPage;
