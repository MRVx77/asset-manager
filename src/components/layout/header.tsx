"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, Package } from "lucide-react";
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

function Header() {
  const pathName = usePathname();
  const router = useRouter();
  const isLoginPage: boolean = pathName === "/login";
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isAdminUser = user?.role === "admin";

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
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href={"/"} className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-teal-500">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-teal-700">
              Asset Manager
            </span>
          </Link>

          <nav className="items-center flex gap-6 ml-6">
            {!isPending && isAdminUser ? null : (
              <Link
                href={"/gallery"}
                className="text-md font-medium hover:text-teal-600"
              >
                Gallery
              </Link>
            )}
            {!isPending && user && !isAdminUser && (
              <>
                <Link
                  href={"/dashbord/assets"}
                  className="text-md font-medium hover:text-teal-600"
                >
                  Assets
                </Link>

                <Link
                  href={"/dashbord/purchases"}
                  className="text-md font-medium hover:text-teal-600"
                >
                  My Purchases
                </Link>
              </>
            )}

            {isAdminUser && !isPending && user && (
              <>
                <Link
                  href={"/admin/assets-approval"}
                  className="text-md font-medium hover:text-teal-600"
                >
                  Assets Approval
                </Link>

                <Link
                  href={"/admin/settings"}
                  className="text-md font-medium hover:text-teal-600"
                >
                  Settings
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-6 text-lg">
          {isPending ? null : user ? (
            <div className="felx items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="relative h-8 w-8 rounded-full cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 border border-slate-300">
                      <AvatarFallback className="bg-teal-500 text-white">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "X"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div className="felx flex-col space-y-1 ">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="cursor-pointer text-red-500" />
                    <span className="font-medium">LogOut</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
                <DropdownMenuSeparator />
              </DropdownMenu>
            </div>
          ) : (
            <Link href={"/login"}>
              <Button className="bg-teal-500 hover:bg-teal-700 text-white">
                LogIn
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
