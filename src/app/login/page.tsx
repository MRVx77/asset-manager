import AuthLayout from "@/components/auth/auth-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Package } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="flex flex-col items-center gap-3 py-8 bg-teal-50">
          <div className="p-4 rounded-full bg-teal-500">
            <Package className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-teal-600">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-600 text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-8">
          <AuthLayout />
        </CardContent>

        <CardFooter className="flex justify-center py-4 bg-slate-50">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-teal-600 transition-colors"
          >
            Back to Home Page
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
