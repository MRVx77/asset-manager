"use client";

import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteAssetAction } from "@/actions/dashbord-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Asset = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  isApproved: string;
  categoryId: number | null;
  createdAt: Date;
};

interface AssetGridProps {
  assets: Asset[];
}

function AssetGrid({ assets }: AssetGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);

      const res = await deleteAssetAction(id);

      if (res.success) {
        toast.success(res.message);
        router.refresh(); // refresh data
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="group relative rounded-2xl overflow-hidden bg-white/70 backdrop-blur border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="relative h-52 overflow-hidden">
            <Image
              src={asset.fileUrl}
              alt={asset.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

            <div className="absolute top-3 left-3">
              <Badge
                className={`backdrop-blur-md text-white border-none
                  ${
                    asset.isApproved === "approved"
                      ? "bg-emerald-500/80"
                      : asset.isApproved === "rejected"
                        ? "bg-red-500/80"
                        : "bg-yellow-400/80 text-black"
                  }`}
              >
                {asset.isApproved === "approved"
                  ? "Approved"
                  : asset.isApproved === "rejected"
                    ? "Rejected"
                    : "Pending"}
              </Badge>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(asset.id)}
              disabled={deletingId === asset.id}
              className="absolute top-3 right-3 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition"
            >
              {deletingId === asset.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-base truncate">{asset.title}</h3>

            {asset.description && (
              <p className="text-sm text-gray-500 line-clamp-2">
                {asset.description}
              </p>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(asset.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AssetGrid;
