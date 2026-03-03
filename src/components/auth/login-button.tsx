"use client";

import { Button } from "../ui/button";

function LoginButton() {
  return (
    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 text-base font-medium">
      <span>Sing in with google</span>
    </Button>
  );
}

export default LoginButton;
