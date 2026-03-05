"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import ProfileC from "./@ProfileComponents/ProfileC";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/Login");
    }
  }, [router]);
  return (
    <main className="">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link
            href="/customer/home"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            title="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your account information and settings
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ProfileC />
      </div>
    </main>
  );
};

export default page;
