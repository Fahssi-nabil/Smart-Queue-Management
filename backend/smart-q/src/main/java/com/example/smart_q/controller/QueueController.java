package com.example.smart_q.controller;

import com.example.smart_q.dto.CreateTicketRequest;
import com.example.smart_q.dto.TicketResponse;
import com.example.smart_q.service.QueueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/queue")
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    /**
     * Customer joins queue (creates ticket)
     */
    @PostMapping("/tickets")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody CreateTicketRequest request) {
        TicketResponse response = queueService.createTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all tickets (ADMIN ONLY - shows all tickets with all statuses)
     */
    @GetMapping("/all-tickets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        List<TicketResponse> tickets = queueService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    /**
     * ✅ NEW: Get my ticket (CUSTOMER ONLY - shows only their own ticket)
     */
    @GetMapping("/tickets/my-ticket")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<TicketResponse> getMyTicket() {
        TicketResponse ticket = queueService.getMyTicket();
        return ResponseEntity.ok(ticket);
    }


    /**
     * ✅ Call next ticket (ADMIN ONLY)
     */
    @PostMapping("/call-next")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> callNextTicket() {
        TicketResponse ticket = queueService.callNextTicket();
        return ResponseEntity.ok(ticket);
    }

    /**
     * ✅ Get currently serving ticket (ADMIN ONLY)
     */
    @GetMapping("/currently-serving")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> getCurrentlyServing() {
        TicketResponse ticket = queueService.getCurrentlyServing();
        return ResponseEntity.ok(ticket);
    }

}
