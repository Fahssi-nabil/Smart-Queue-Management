package com.example.smart_q.controller;

import com.example.smart_q.dto.KpiResponse;
import com.example.smart_q.dto.RecentActivityResponse;
import com.example.smart_q.dto.ServiceTypeBreakdownResponse;
import com.example.smart_q.dto.StatusDistributionResponse;
import com.example.smart_q.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * Get KPI statistics
     */
    @GetMapping("/kpi")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<KpiResponse> getKpiStats() {
        KpiResponse kpi = analyticsService.getKpiStats();
        return ResponseEntity.ok(kpi);
    }

    /**
     * ✅ NEW: Get service type breakdown
     */
    @GetMapping("/service-breakdown")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceTypeBreakdownResponse> getServiceTypeBreakdown() {
        ServiceTypeBreakdownResponse breakdown = analyticsService.getServiceTypeBreakdown();
        return ResponseEntity.ok(breakdown);
    }


    /**
     * ✅ NEW: Get status distribution
     */
    @GetMapping("/status-distribution")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StatusDistributionResponse> getStatusDistribution() {
        StatusDistributionResponse distribution = analyticsService.getStatusDistribution();
        return ResponseEntity.ok(distribution);
    }

    /**
     * ✅ NEW: Get recent activity
     */
    @GetMapping("/recent-activity")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RecentActivityResponse> getRecentActivity() {
        RecentActivityResponse activity = analyticsService.getRecentActivity();
        return ResponseEntity.ok(activity);
    }


}
