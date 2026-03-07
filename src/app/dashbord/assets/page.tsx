import { getCategoriesAction } from "@/actions/dashbord-action";
import AssetGrid from "@/components/dashbord/asset-grid";
import UploadAsset from "@/components/dashbord/upload-asset";

async function userAssetsPage() {
  const [categories] = await Promise.all([getCategoriesAction()]);
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
