"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, Package, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useState } from "react";

function Header() {
  const pathName = usePathname();
  const router = useRouter();
  const isLoginPage = pathName === "/login";
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isAdminUser = user?.role === "admin";

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  if (isLoginPage) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-teal-500">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-teal-700">PixelGallery</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-md font-medium">
          <NavLinks
            isPending={isPending}
            user={user}
            isAdminUser={isAdminUser}
          />
        </nav>

        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>

          {isPending ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8 border border-slate-300">
                    <AvatarFallback className="bg-teal-500 text-white">
                      {user?.name?.charAt(0).toUpperCase() || "X"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="text-red-500 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="bg-teal-500 hover:bg-teal-700 text-white">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-4 font-medium">
          <NavLinks
            isPending={isPending}
            user={user}
            isAdminUser={isAdminUser}
          />
        </div>
      )}
    </header>
  );
}

export default Header;

function NavLinks({ isPending, user, isAdminUser }: any) {
  return (
    <>
      {!isPending && !isAdminUser && (
        <Link href="/gallery" className="hover:text-teal-600">
          Gallery
        </Link>
      )}

      {!isPending && user && !isAdminUser && (
        <>
          <Link href="/dashbord/assets" className="hover:text-teal-600">
            Assets
          </Link>
          <Link href="/dashbord/purchases" className="hover:text-teal-600">
            My Purchases
          </Link>
        </>
      )}

      {isAdminUser && user && !isPending && (
        <>
          <Link href="/admin/assets-approval" className="hover:text-teal-600">
            Assets Approval
          </Link>
          <Link href="/admin/settings" className="hover:text-teal-600">
            Settings
          </Link>
        </>
      )}
    </>
  );
}
