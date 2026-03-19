import {
  getCategoriesAction,
  getPublicAssetAction,
} from "@/actions/dashbord-action";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface GallaryPageProps {
  searchParams: {
    category?: string;
  };
}

async function GalleryPage({ searchParams }: GallaryPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && session.user?.role === "admin") redirect("/");

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[65vh]:">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      }
    >
      <GalleryContent searchParams={searchParams} />
    </Suspense>
  );
}

export default GalleryPage;

async function GalleryContent({ searchParams }: GallaryPageProps) {
  const resolvedSearchParams = await searchParams;
  const categoryId = resolvedSearchParams?.category
    ? Number.parseInt(resolvedSearchParams.category)
    : undefined;

  const categories = await getCategoriesAction();
  const asset = await getPublicAssetAction(categoryId);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Page Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Bar */}
        <div className="sticky top-16 z-30 backdrop-blur bg-white/70 border-b">
          <div className="flex gap-2 overflow-x-auto py-3">
            <Button
              variant={!categoryId ? "default" : "outline"}
              size="sm"
              className={`rounded-full px-4 ${
                !categoryId ? "bg-black text-white shadow-sm" : ""
              }`}
              asChild
            >
              <Link href="/gallery">All</Link>
            </Button>

            {categories.map((c) => (
              <Button
                key={c.id}
                variant={categoryId === c.id ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-4 transition ${
                  categoryId === c.id
                    ? "bg-black text-white shadow-sm"
                    : "hover:bg-slate-100"
                }`}
                asChild
              >
                <Link href={`/gallery?category=${c.id}`}>{c.name}</Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="py-10 sm:py-12">
          {asset.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-xl sm:text-2xl font-semibold text-slate-700">
                No assets yet
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Upload your first asset to get started 🚀
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {asset.map(({ asset, categoryName, userName }) => (
                <Link
                  href={`/gallery/${asset.id}`}
                  key={asset.id}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-square">
                      <Image
                        src={asset.fileUrl}
                        alt={asset.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                    {/* Content */}
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1">
                        {asset.title}
                      </h3>

                      <div className="flex justify-between items-center mt-2 text-xs sm:text-sm">
                        <span className="text-white/80">{userName}</span>

                        {categoryName && (
                          <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-full text-white text-xs">
                            {categoryName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
