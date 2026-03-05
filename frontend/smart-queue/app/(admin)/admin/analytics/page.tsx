"use client";

import React, { useEffect, useState } from "react";
import { 
  analyticsService, 
  KpiStats, 
  ServiceTypeBreakdown, 
  StatusDistribution,
  RecentActivity
} from "@/services/analyticsService";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Calendar, TrendingDown } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const COLORS = {
  DONE: "#10b981",
  WAITING: "#f59e0b",
  SERVING: "#3b82f6",
  SKIPPED: "#ef4444",
};

export default function AnalyticsPage() {
  const [kpi, setKpi] = useState<KpiStats | null>(null);
  const [serviceBreakdown, setServiceBreakdown] = useState<ServiceTypeBreakdown | null>(null);
  const [statusDistribution, setStatusDistribution] = useState<StatusDistribution | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [kpiData, breakdownData, distributionData, activityData] = await Promise.all([
        analyticsService.getKpiStats(),
        analyticsService.getServiceTypeBreakdown(),
        analyticsService.getStatusDistribution(),
        analyticsService.getRecentActivity(),
      ]);
      
      setKpi(kpiData);
      setServiceBreakdown(breakdownData);
      setStatusDistribution(distributionData);
      setRecentActivity(activityData);
    } catch (error) {
      toast.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE": return "bg-green-100 text-green-700";
      case "WAITING": return "bg-yellow-100 text-yellow-700";
      case "SERVING": return "bg-blue-100 text-blue-700";
      case "SKIPPED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="w-14 h-14" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Performance metrics and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Service Type Breakdown
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Distribution of tickets by service type
            </p>
          </CardHeader>
          <CardContent>
            {serviceBreakdown && serviceBreakdown.data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serviceBreakdown.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="serviceType" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                            <p className="font-semibold">{payload[0].payload.serviceType}</p>
                            <p className="text-blue-600">Count: {payload[0].value}</p>
                            <p className="text-gray-600">
                              {payload[0].payload.percentage}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Tickets" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Ticket Status Distribution
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Breakdown of tickets by status
            </p>
          </CardHeader>
          <CardContent>
            {statusDistribution && statusDistribution.data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution.data}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ status, percentage }) => `${status} (${percentage}%)`}
                  >
                    {statusDistribution.data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.status as keyof typeof COLORS] || "#6b7280"} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                            <p className="font-semibold">{payload[0].name}</p>
                            <p className="text-gray-900">Count: {payload[0].value}</p>
                            <p className="text-gray-600">
                              {payload[0].payload.percentage}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
                      <TableCell>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {activity.waitTime > 0 ? `${activity.waitTime} min` : "-"}
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
  );
}