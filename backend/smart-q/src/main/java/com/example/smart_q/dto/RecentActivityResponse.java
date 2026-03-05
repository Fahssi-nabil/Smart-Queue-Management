package com.example.smart_q.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityResponse {
    private List<ActivityData> data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityData {
        private Long id;
        private Integer ticketNumber;
        private String customerName;
        private String serviceType;
        private String status;
        private Integer waitTime;
        private String createdAt;
    }
}
