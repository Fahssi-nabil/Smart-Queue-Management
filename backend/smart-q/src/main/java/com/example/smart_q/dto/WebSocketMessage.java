package com.example.smart_q.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {
    private String type; // "TICKET_CREATED", "TICKET_CALLED", "TICKET_SKIPPED", "QUEUE_UPDATE"
    private Object payload; // TicketResponse or QueueUpdatePayload
    private Long timestamp;
}
