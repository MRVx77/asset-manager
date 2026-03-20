import Link from "next/link";
import { FaInstagram, FaTwitter, FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-100 text-slate-700 py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-bold text-teal-600">PixelGallery</h2>
          <p className="mt-2 max-w-xs text-sm">
            Discover, share, and sell stunning digital assets. PixelGallery
            makes it easy for creators to showcase their work and earn from
            their art.
          </p>
        </div>

        <div className="flex gap-12">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Explore</h3>
            <Link href="/gallery" className="hover:text-teal-600">
              Gallery
            </Link>
            <Link href="/dashbord/assets" className="hover:text-teal-600">
              Assets
            </Link>
            <Link href="/gallery" className="hover:text-teal-600">
              New Uploads
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Account</h3>
            <Link href="/login" className="hover:text-teal-600">
              Sign Up
            </Link>
            <Link href="/login" className="hover:text-teal-600">
              Login
            </Link>
            <Link href="/" className="hover:text-teal-600">
              Dashboard
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Support</h3>
            <Link href="/" className="hover:text-teal-600">
              Help Center
            </Link>
            <Link href="/" className="hover:text-teal-600">
              FAQ
            </Link>
            <Link href="/" className="hover:text-teal-600">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-300 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">
          &copy; 2026 PixelGallery. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-teal-600">
            <FaInstagram className="w-5 h-5" />
          </Link>
          <Link href="#" className="hover:text-teal-600">
            <FaTwitter className="w-5 h-5" />
          </Link>
          <Link href="#" className="hover:text-teal-600">
            <FaDiscord className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
