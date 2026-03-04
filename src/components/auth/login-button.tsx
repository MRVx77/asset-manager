"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "../ui/button";

function LoginButton() {
  const handleLogin = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <Button
      onClick={handleLogin}
      className="w-full bg-teal-500 hover:bg-teal-600 hover:cursor-pointer text-white py-6 text-base font-medium"
    >
      <span>Sing in with google</span>
    </Button>
  );
}

export default LoginButton;
