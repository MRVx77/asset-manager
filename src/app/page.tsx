import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Share, Upload } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 py-24 md:py-32 relative">
      <div className="container flex flex-col items-center text-center">
        <div className="flex flex-col items-center">
          <div className="mb-6 p-4 rounded-full bg-teal-500">
            <Package className="text-white h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-teal-600">
            Welcome to PixelGallery
          </h1>
        </div>
        <p className="mt-6 max-w-150 text-lg text-slate-700">
          Upload, organize, share, and sell your digital assets with ease.
        </p>
        <div className="mt-12 flex flex-wrap gap-6 justify-center">
          <Link href={"/gallery"}>
            <Button className="bg-teal-500 text-white px-9 py-7 text-lg cursor-pointer">
              Explore PixelGallery
            </Button>
          </Link>
        </div>
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <Card className="shadow">
            <CardHeader className="pb-2 flex flex-col items-center">
              <div className="p-3 rounded-full bg-teal-100 mb-2">
                <Package className="w-6 h-6 text-teal-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-center">
                Organize Your Pixels
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-slate-500">
                Easily categorize and manage all your images in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow">
            <CardHeader className="pb-2 flex flex-col items-center">
              <div className="p-3 rounded-full bg-teal-100 mb-2">
                <Upload className="w-6 h-6 text-teal-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-center">
                Upload Your Creations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-slate-500">
                Showcase your Images/wallpapers and digital art to the world.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow">
            <CardHeader className="pb-2 flex flex-col items-center">
              <div className="p-3 rounded-full bg-teal-100 mb-2">
                <Share className="w-6 h-6 text-teal-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-center">
                Share & Earn
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-slate-500">
                Share your assets and start earning instantly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
