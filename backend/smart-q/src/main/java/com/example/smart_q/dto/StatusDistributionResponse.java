package com.example.smart_q.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusDistributionResponse {
    private List<StatusData> data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusData {
        private String status;
        private Integer count;
        private Double percentage;
    }
}
