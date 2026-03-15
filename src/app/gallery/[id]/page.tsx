import { getAssetByIdAction } from "@/actions/dashbord-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Info, Loader2, Tag } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

interface GalleryDelatiPageProps {
  params: {
    id: string;
  };
}

function GalleryDetailsPage({ params }: GalleryDelatiPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[65vh]:">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      }
    >
      <GalleryContent params={params} />
    </Suspense>
  );
}

export default GalleryDetailsPage;

async function GalleryContent({ params }: GalleryDelatiPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { id } = await params;

  if (session && session?.user?.role === "admin") {
    redirect("/");
  }

  const result = await getAssetByIdAction(id);

  if (!result) {
    notFound();
  }

  const { asset, categoryName, userName, userImage, userId } = result;

  const isAuthor = session?.user.id === userId;
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const hasPurchaseAsset = false;

  return (
    <div className="min-h-screen container px-4 bg-white">
      <div className="container py-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <div className="rounded-lg overflow-hidden bg-gray-100 border">
              <div className="relative w-full">
                <Image
                  src={asset.fileUrl}
                  alt={asset.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{asset.title}</h1>
                {categoryName && (
                  <Badge className="mt-2 bg-gray-200 text-gray-700 hover:bg-gray-100">
                    <Tag className="mr-1 h-4 w-4" />
                    {categoryName}
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-md font-medium">{userName}</p>
                <p className="text-sm text-gray-500">Creator</p>
              </div>
            </div>
            <div className="w-full">
              <p className="text-black font-bold">
                Description :{" "}
                <span className="text-md font-medium text-gray-600">
                  {asset.description}
                </span>
              </p>
            </div>
          </div>
          <div className=" space-y-6">
            <div className="sticky top-24">
              <Card className="overflow-hidden border-0 shadow-lg rounded-xl bg-linear-to-r from-gray-900 to-gray-700 text-white">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Premium Asset</h3>
                  <div>
                    <span className="text-3xl font-bold mr-2">$5.00</span>
                    <span className=" ml-2 text-gray-300 ">
                      One Time Purchase
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {session?.user ? (
                      isAuthor ? (
                        <div className="bg-blue-50 text-blue-700 p-5 rounded-lg flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
                          <p className="text-sm">
                            This is your asset, You cant buy your own asset.
                          </p>
                        </div>
                      ) : hasPurchaseAsset ? (
                        <Button></Button>
                      ) : (
                        <form action="">
                          <Button></Button>
                        </form>
                      )
                    ) : (
                      <>
                        <Button
                          asChild
                          className="w-full bg-black text-white h-12"
                        >
                          <Link href={"/login"}>Sign In to Purchase</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
