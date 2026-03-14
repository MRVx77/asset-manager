import { getAssetByIdAction } from "@/actions/dashbord-action";
import { auth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
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

  return <div className="min-h-screen container px-4 bg-white"></div>;
}
