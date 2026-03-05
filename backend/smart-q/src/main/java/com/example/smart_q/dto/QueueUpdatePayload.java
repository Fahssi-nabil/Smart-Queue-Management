package com.example.smart_q.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueueUpdatePayload {
    private Integer totalWaiting;
    private Integer currentlyServing;
    private Integer totalCompleted;
    private List<TicketResponse> waitingTickets;
    private TicketResponse servingTicket;
}
