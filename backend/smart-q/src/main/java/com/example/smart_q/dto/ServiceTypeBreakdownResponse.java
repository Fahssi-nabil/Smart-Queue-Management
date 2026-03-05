package com.example.smart_q.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceTypeBreakdownResponse {
    private List<ServiceTypeData> data;
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceTypeData {
        private String serviceType;
        private Integer count;
        private Double percentage;
    }
}
