package com.example.smart_q.dto;

import com.example.smart_q.enums.ServiceType;
import com.example.smart_q.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private Long id;
    private Integer ticketNumber;
    private TicketStatus status;
    private ServiceType serviceType;
    private String customerName;
    private String customerEmail;
    private LocalDateTime createdAt;
    private Integer position;
    private Integer estimatedWaitTime; // in minutes
}
