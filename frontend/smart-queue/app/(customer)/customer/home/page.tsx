"use client";

import { getFullName, getUserRole, isAuthenticated } from "@/lib/auth";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Ticket,
  TrendingUp,
  Zap,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const Page = () => {
  const [role, setRole] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/Login");
    }
    setRole(getUserRole());
    setFullName(getFullName());
  }, [router]);

  return (
    <div className="p-6 lg:p-10 max-w-8xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
            Welcome Back,{" "}
            <span className="text-primary">{fullName}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your queue tickets efficiently and effortlessly.
          </p>
        </div>

        <div className="bg-primary/10 px-5 py-3 rounded-xl">
          <p className="text-sm text-muted-foreground">Your Role</p>
          <p className="font-semibold text-primary">{role}</p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Join Queue */}
        <Link href="/customer/join">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/15 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full border border-border">
            <div className="flex flex-col h-full space-y-5">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-grow space-y-2">
                <h3 className="text-xl font-semibold">Join Queue</h3>
                <p className="text-muted-foreground">
                  Get a new ticket and join the queue quickly.
                </p>
              </div>

              <div className="flex items-center gap-2 text-primary font-medium">
                Start Now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Card>
        </Link>

        {/* My Tickets */}
        <Link href="/customer/my-ticket">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/15 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full border border-border">
            <div className="flex flex-col h-full space-y-5">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-grow space-y-2">
                <h3 className="text-xl font-semibold">My Tickets</h3>
                <p className="text-muted-foreground">
                  Track your position and estimated waiting time.
                </p>
              </div>

              <div className="flex items-center gap-2 text-primary font-medium">
                View Tickets <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Card>
        </Link>

        {/* My Profile */}
        <Link href="/profile">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/15 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full border border-border">
            <div className="flex flex-col h-full space-y-5">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-grow space-y-2">
                <h3 className="text-xl font-semibold">My Profile</h3>
                <p className="text-muted-foreground">
                  Manage your personal account information.
                </p>
              </div>

              <div className="flex items-center gap-2 text-primary font-medium">
                View Profile <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Why Choose Us */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Why Choose Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 flex gap-4 border border-border hover:shadow-md transition">
            <CheckCircle className="w-6 h-6 text-primary mt-1" />
            <div>
              <h4 className="font-semibold">Fair Queue System</h4>
              <p className="text-sm text-muted-foreground">
                First-in, first-out system ensures fairness.
              </p>
            </div>
          </Card>

          <Card className="p-6 flex gap-4 border border-border hover:shadow-md transition">
            <TrendingUp className="w-6 h-6 text-primary mt-1" />
            <div>
              <h4 className="font-semibold">Real-time Updates</h4>
              <p className="text-sm text-muted-foreground">
                Live updates about your ticket status.
              </p>
            </div>
          </Card>

          <Card className="p-6 flex gap-4 border border-border hover:shadow-md transition">
            <Zap className="w-6 h-6 text-primary mt-1" />
            <div>
              <h4 className="font-semibold">Fast Processing</h4>
              <p className="text-sm text-muted-foreground">
                Average waiting time under 8 minutes.
              </p>
            </div>
          </Card>

          <Card className="p-6 flex gap-4 border border-border hover:shadow-md transition">
            <Clock className="w-6 h-6 text-primary mt-1" />
            <div>
              <h4 className="font-semibold">24/7 Access</h4>
              <p className="text-sm text-muted-foreground">
                Access your tickets anytime, anywhere.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
