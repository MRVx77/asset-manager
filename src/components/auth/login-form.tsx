"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { signIn } from "@/lib/auth-client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

//schema
const LoginSchema = z.object({
  email: z.string().email("please enter a valid email address"),
  password: z.string().min(6, "password must be at least 6 characters long"),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
      });
      if (error) {
        toast.error(`SignUp failed: ${error.message}`);
        return;
      }

      toast("Login successful! Welcome.");
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-teal-600">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-teal-600">Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center text-sm text-gray-500">OR</div>

      <Button
        type="button"
        onClick={async () =>
          await signIn.social({
            provider: "google",
            callbackURL: "/",
          })
        }
        className="w-full bg-teal-500 text-white"
      >
        Continue with Google
      </Button>
    </Form>
  );
}

export default LoginForm;
