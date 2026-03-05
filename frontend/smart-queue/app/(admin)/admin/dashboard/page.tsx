"use client";
import { getUserRole, isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/user.types";
import { TicketInfo } from "@/types/profile.types";
import {
  Users,
  Clock,
  Activity,
  Ticket,
  UserCheck,
  UserPlus,
  Layers,
  TrendingUp,
  TrendingDown,
  Calendar,
  Badge,
} from "lucide-react";
import { userService } from "@/services/userService";
import { TicketService } from "@/services/ticketService";
import {
  analyticsService,
  KpiStats,
  RecentActivity,
} from "@/services/analyticsService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Page = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setloading] = useState(false);
  const [Userss, setUserss] = useState<User[]>([]);
  const [Tickets, setTickets] = useState<TicketInfo[]>([]);
  const [kpi, setKpi] = useState<KpiStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(
    null,
  );
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/Login");
    }
    const userRole = getUserRole();
    setRole(userRole);
  }, [router]);

  const AllUsers = async () => {
    setloading(true);
    try {
      const data = await userService.getAllUsers();
      setUserss(data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const AllTickets = async () => {
    setloading(true);
    try {
      const data = await TicketService.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const fetchKpiStats = async () => {
    setloading(true);
    try {
      const data = await analyticsService.getKpiStats();
      setKpi(data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const fetchRecentActivity = async () => {
    setloading(true);
    try {
      const data = await analyticsService.getRecentActivity();
      setRecentActivity(data);
      console.log("Recent Activity:", data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    AllUsers();
    AllTickets();
    fetchKpiStats();
    fetchRecentActivity();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-green-100 text-green-700";
      case "WAITING":
        return "bg-yellow-100 text-yellow-700";
      case "SERVING":
        return "bg-blue-100 text-blue-700";
      case "SKIPPED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Queue Management System Overview
          </p>
        </div>
      </header>

      {/* Main Content - Only Cards */}
      <main className="p-8">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Queue */}
          <Card className="p-6 bg-card hover:shadow-lg transition-shadow border border-border group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Active Queue
                </p>
                <p className="text-3xl font-bold text-foreground mt-2 group-hover:text-blue-600 transition-colors">
                  {Tickets.length}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ↑ 5 from last hour
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <Layers
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>
          </Card>

          {/* Number of Users - NEW */}
          <Card className="p-6 bg-card hover:shadow-lg transition-shadow border border-border group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-foreground mt-2 group-hover:text-indigo-600 transition-colors">
                  {Userss.length}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ↑ 24 new today
                </p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <Users
                  size={24}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </div>
            </div>
          </Card>

          {/* Number of Tickets - NEW */}
          <Card className="p-6 bg-card hover:shadow-lg transition-shadow border border-border group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Open Tickets
                </p>
                <p className="text-3xl font-bold text-foreground mt-2 group-hover:text-orange-600 transition-colors">
                  {Tickets.length}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  ↓ 8 resolved today
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <Ticket
                  size={24}
                  className="text-orange-600 dark:text-orange-400"
                />
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Served
              </CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {kpi?.totalServed || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                All-time completed tickets
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Wait Time
              </CardTitle>
              <Clock className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {kpi?.averageWaitTime || 0} min
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Average customer wait time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Today
              </CardTitle>
              <Calendar className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {kpi?.totalToday || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tickets created today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Skip Rate
              </CardTitle>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {kpi?.skipRate || 0}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Percentage of skipped tickets
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <div className="recent px-8">
        {/* ✅ NEW: Recent Activity Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Recent Activity
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Last 10 tickets processed
            </p>
          </CardHeader>
          <CardContent>
            {recentActivity && recentActivity.data.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Wait Time</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.data.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-semibold">
                          #{activity.ticketNumber}
                        </TableCell>
                        <TableCell>{activity.customerName}</TableCell>
                        <TableCell>{activity.serviceType}</TableCell>
                        <TableCell >
                          <span className={`${getStatusColor(activity.status)} px-2 py-1 rounded-full text-xs font-medium`}>
                            {activity.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {activity.waitTime > 0
                            ? `${activity.waitTime} min`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {activity.createdAt}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
