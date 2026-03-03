"use client";

import { usePathname } from "next/navigation";

function Header() {
  const pathName = usePathname();
  const isLoginPage: boolean = pathName === "/login";

  if (isLoginPage) return null;

  return <div>headers</div>;
}

export default Header;
