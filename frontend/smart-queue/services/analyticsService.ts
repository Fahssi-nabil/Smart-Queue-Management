import { api } from "@/lib/api";

export interface KpiStats {
  totalServed: number;
  averageWaitTime: number;
  totalToday: number;
  skipRate: number;
}

export interface ServiceTypeBreakdown {
  data: ServiceTypeData[];
}

export interface ServiceTypeData {
  serviceType: string;
  count: number;
  percentage: number;
}

// ✅ NEW: Status Distribution
export interface StatusDistribution {
  data: StatusData[];
}

export interface StatusData {
  status: string;
  count: number;
  percentage: number;
}

// ✅ NEW: Recent Activity
export interface RecentActivity {
  data: ActivityData[];
}


export interface ActivityData {
  id: number;
  ticketNumber: number;
  customerName: string;
  serviceType: string;
  status: string;
  waitTime: number;
  createdAt: string;
}

export const analyticsService = {
  getKpiStats: async (): Promise<KpiStats> => {
    const response = await api.get<KpiStats>("/admin/analytics/kpi");
    return response.data;
  },

  // ✅ NEW
  getServiceTypeBreakdown: async (): Promise<ServiceTypeBreakdown> => {
    const response = await api.get<ServiceTypeBreakdown>(
      "/admin/analytics/service-breakdown",
    );
    return response.data;
  },

  // ✅ NEW
  getStatusDistribution: async (): Promise<StatusDistribution> => {
    const response = await api.get<StatusDistribution>("/admin/analytics/status-distribution");
    return response.data;
  },

  // ✅ NEW
  getRecentActivity: async (): Promise<RecentActivity> => {
    const response = await api.get<RecentActivity>("/admin/analytics/recent-activity");
    return response.data;
  },
};
