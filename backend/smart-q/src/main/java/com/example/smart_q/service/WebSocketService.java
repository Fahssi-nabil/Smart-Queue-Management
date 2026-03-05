package com.example.smart_q.service;

import com.example.smart_q.dto.QueueUpdatePayload;
import com.example.smart_q.dto.TicketResponse;
import com.example.smart_q.dto.WebSocketMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Send message to all connected clients
     */
    public void broadcastMessage(String type, Object payload) {
        WebSocketMessage message = new WebSocketMessage(
                type,
                payload,
                System.currentTimeMillis()
        );

        messagingTemplate.convertAndSend("/topic/queue", message);
        log.info("WebSocket broadcast: type={}, payload={}", type, payload.getClass().getSimpleName());
    }


    public void broadcastTicketCreated(TicketResponse ticket) {
        broadcastMessage("TICKET_CREATED", ticket);
    }

    public void broadcastTicketCalled(TicketResponse ticket) {
        broadcastMessage("TICKET_CALLED", ticket);
    }

    public void broadcastTicketSkipped(TicketResponse ticket) {
        broadcastMessage("TICKET_SKIPPED", ticket);
    }

    public void broadcastQueueUpdate(QueueUpdatePayload payload) {
        broadcastMessage("QUEUE_UPDATE", payload);
    }


}
