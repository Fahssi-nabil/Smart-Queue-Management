"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// 1️⃣ Zod Schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm() {
  const router = useRouter();

  // 2️⃣ Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3️⃣ Submit function
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        "http://localhost:8084/api/auth/login",
        values,

        { headers: { "Content-Type": "application/json" } },
      );

      const { token, role , name} = response.data;

      document.cookie = `token=${token}; path=/; samesite=lax; max-age=86400`;
      document.cookie = `role=${role}; path=/; samesite=lax; max-age=86400`;

      // Optional: Also store in localStorage for client-side use
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("full", name);
      toast.success("Logged in successfully!");
      if (role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (role === "CUSTOMER") {
        router.replace("/customer/home");
      }

      router.refresh();
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Login In
        </Button>
      </form>

      <div className="Message flex items-center justify-center pt-4 space-x-1">
        <p>Don't have an Account?</p>
        <Link href="/Register">
          <span className="text-blue-400">Sign Up</span>
        </Link>
      </div>
    </Form>
  );
}
