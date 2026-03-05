package com.example.smart_q.service;

import com.example.smart_q.dto.CreateTicketRequest;
import com.example.smart_q.dto.QueueUpdatePayload;
import com.example.smart_q.dto.TicketResponse;

import com.example.smart_q.enums.TicketStatus;
import com.example.smart_q.model.QueueTicket;
import com.example.smart_q.model.User;
import com.example.smart_q.repository.QueueTicketRepository;
import com.example.smart_q.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QueueService {

    private final QueueTicketRepository queueTicketRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;

    private static final int AVERAGE_SERVICE_TIME = 5; // minutes per customer

    /**
     * ✅ Get current user BY ID
     */
    private User getCurrentUser() {
        String userIdStr = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(userIdStr);

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    /**
     * Create new ticket (customer joins queue)
     */
    @Transactional
    public TicketResponse createTicket(CreateTicketRequest request) {

        User user = getCurrentUser();

        // Check if user already has an active ticket
        queueTicketRepository.findActiveTicketByUserId(user.getId())
                .ifPresent(ticket -> {
                    throw new RuntimeException("You already have an active ticket #" + ticket.getTicketNumber());
                });

        // Generate next ticket number
        Integer nextTicketNumber = generateNextTicketNumber();

        // Create new ticket
        QueueTicket ticket = new QueueTicket();
        ticket.setTicketNumber(nextTicketNumber);
        ticket.setStatus(TicketStatus.WAITING);
        ticket.setServiceType(request.getServiceType());
        ticket.setUser(user);


        QueueTicket savedTicket = queueTicketRepository.save(ticket);
        log.info("Ticket created: #{} for user: {}", nextTicketNumber, user.getId() ,  user.getEmail());

        // ✅ Calculate position DYNAMICALLY after saving
        int position = calculatePosition(savedTicket);
        int estimatedWaitTime = (position - 1) * AVERAGE_SERVICE_TIME;

        TicketResponse response = mapToResponse(savedTicket, position, estimatedWaitTime);
        // Broadcast new ticket to all clients
        webSocketService.broadcastTicketCreated(response);

        return response;
    }



    /**
     * Get all tickets in queue (ADMIN ONLY - all tickets, all statuses)
     */
    public List<TicketResponse> getAllTickets() {
        List<QueueTicket> tickets = queueTicketRepository.findAll();

        // Sort tickets: SERVING first, then WAITING (by creation time), then DONE/SKIPPED
        tickets.sort((t1, t2) -> {
            if (t1.getStatus() == TicketStatus.SERVING && t2.getStatus() != TicketStatus.SERVING) return -1;
            if (t2.getStatus() == TicketStatus.SERVING && t1.getStatus() != TicketStatus.SERVING) return 1;
            if (t1.getStatus() == TicketStatus.WAITING && t2.getStatus() == TicketStatus.WAITING)
                return t1.getCreatedAt().compareTo(t2.getCreatedAt());
            if (t1.getStatus() == TicketStatus.WAITING && t2.getStatus() != TicketStatus.WAITING) return -1;
            if (t2.getStatus() == TicketStatus.WAITING && t1.getStatus() != TicketStatus.WAITING) return 1;
            return t2.getCreatedAt().compareTo(t1.getCreatedAt());
        });

        // ✅ Calculate position dynamically for each ticket
        List<TicketResponse> responses = new ArrayList<>();
        int position = 1;

        for (QueueTicket ticket : tickets) {
            int currentPosition = 0;
            int waitTime = 0;

            if (ticket.getStatus() == TicketStatus.WAITING) {
                currentPosition = position;
                waitTime = (position - 1) * AVERAGE_SERVICE_TIME;
                position++;
            } else if (ticket.getStatus() == TicketStatus.SERVING) {
                currentPosition = 0; // Being served now
                waitTime = 0;
            }

            responses.add(mapToResponse(ticket, currentPosition, waitTime));
        }

        return responses;
    }


    /**
     * Get customer's own ticket (CUSTOMER ONLY)
     */
    public TicketResponse getMyTicket() {
         User user = getCurrentUser();

        QueueTicket ticket = queueTicketRepository.findActiveTicketByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("You don't have any active ticket"));

        // ✅ Calculate position DYNAMICALLY
        int position = calculatePosition(ticket);
        int estimatedWaitTime = (position - 1) * AVERAGE_SERVICE_TIME;

        return mapToResponse(ticket, position, estimatedWaitTime);
    }


    /**
     * ✅ Calculate position dynamically based on current queue state
     */
    private int calculatePosition(QueueTicket ticket) {
        if (ticket.getStatus() == TicketStatus.SERVING) {
            return 0; // Being served now
        }

        if (ticket.getStatus() != TicketStatus.WAITING) {
            return 0; // DONE or SKIPPED
        }

        // Get all waiting tickets ordered by creation time
        List<QueueTicket> waitingTickets = queueTicketRepository
                .findByStatusOrderByCreatedAtAsc(TicketStatus.WAITING);

        // Find position in queue
        for (int i = 0; i < waitingTickets.size(); i++) {
            if (waitingTickets.get(i).getId().equals(ticket.getId())) {
                return i + 1;
            }
        }

        return 0;
    }





    /**
     * ✅ NEW: Broadcast full queue update to all clients
     */
      private void broadcastFullQueueUpdate() {
          List<TicketResponse> allTickets = getAllTickets();

          List<TicketResponse> waitingTickets = allTickets.stream()
                  .filter(t -> t.getStatus() == TicketStatus.WAITING)
                  .collect(Collectors.toList());

          TicketResponse servingTicket = allTickets.stream()
                  .filter(t -> t.getStatus() == TicketStatus.SERVING)
                  .findFirst()
                  .orElse(null);

          long completedCount = allTickets.stream()
                  .filter(t -> t.getStatus() == TicketStatus.DONE)
                  .count();

          QueueUpdatePayload payload = new QueueUpdatePayload(
                  waitingTickets.size(),
                  servingTicket != null ? 1 : 0,
                  (int) completedCount,
                  waitingTickets,
                  servingTicket
          );

            webSocketService.broadcastQueueUpdate(payload);

      }


    /**
     * ✅ CALL NEXT TICKET (Admin only)
     * Smart logic:
     * - If NO ticket is SERVING → Mark first WAITING as SERVING (initial case)
     * - If ticket is SERVING → Mark it DONE, then mark next WAITING as SERVING
     */

    @Transactional
    public TicketResponse callNextTicket() {
        // Step 1: Check if there's a ticket currently being served
        List<QueueTicket> servingTickets = queueTicketRepository
                .findByStatusOrderByCreatedAtAsc(TicketStatus.SERVING);

        if (!servingTickets.isEmpty()) {
            // Case: Ticket is currently SERVING → Mark it DONE
            QueueTicket currentlyServing = servingTickets.get(0);
            currentlyServing.setStatus(TicketStatus.DONE);
            currentlyServing.setCompletedAt(LocalDateTime.now());
            queueTicketRepository.save(currentlyServing);

            log.info("Ticket #{} marked as DONE", currentlyServing.getTicketNumber());
        } else {
            // Case: NO ticket is SERVING (initial state)
            log.info("No ticket currently serving - calling first waiting ticket");
        }

        // Step 2: Get first WAITING ticket (FIFO - oldest first)
        QueueTicket nextTicket = queueTicketRepository
                .findFirstByStatusOrderByCreatedAtAsc(TicketStatus.WAITING)
                .orElseThrow(() -> new RuntimeException("No tickets in waiting queue"));

        // Step 3: Mark as SERVING
        nextTicket.setStatus(TicketStatus.SERVING);
        nextTicket.setServedAt(LocalDateTime.now());
        QueueTicket updatedTicket = queueTicketRepository.save(nextTicket);

        log.info("Ticket #{} is now being served (User: {})",
                updatedTicket.getTicketNumber(),
                updatedTicket.getUser().getEmail());

        // Step 4: Broadcast update to all clients
        TicketResponse response = mapToResponse(updatedTicket, 0, 0);

        webSocketService.broadcastTicketCalled(response);

        // ✅ Broadcast full queue update (so all positions recalculate)

            broadcastFullQueueUpdate();


         return response;


    }

    /**
     * ✅ Get currently serving ticket
     */
    public TicketResponse getCurrentlyServing() {
        QueueTicket servingTicket = queueTicketRepository
                .findFirstByStatusOrderByCreatedAtAsc(TicketStatus.SERVING)
                .orElse(null);

        if (servingTicket == null) {
            throw new RuntimeException("No ticket is currently being served");
        }

        return mapToResponse(servingTicket, 0, 0);
    }



    /**
     * Generate next ticket number for today
     */
    private Integer generateNextTicketNumber() {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        return queueTicketRepository
                .findTopByCreatedAtBetweenOrderByTicketNumberDesc(startOfDay, endOfDay)
                .map(ticket -> ticket.getTicketNumber() + 1)
                .orElse(1);
    }

    /**
     * Map QueueTicket entity to TicketResponse DTO
     */
    private TicketResponse mapToResponse(QueueTicket ticket, Integer position, Integer estimatedWaitTime) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getTicketNumber(),
                ticket.getStatus(),
                ticket.getServiceType(),
                ticket.getUser().getName(),
                ticket.getUser().getEmail(),
                ticket.getCreatedAt(),
                position,
                estimatedWaitTime
        );
    }
}
