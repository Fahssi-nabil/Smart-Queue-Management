package com.example.smart_q.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KpiResponse {
    private Integer totalServed;      // Total DONE tickets
    private Double averageWaitTime;   // Avg wait time in minutes
    private Integer totalToday;       // Tickets created today
    private Double skipRate;          // Percentage of SKIPPED tickets
}
