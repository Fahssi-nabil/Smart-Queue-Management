package com.example.smart_q.repository;

import com.example.smart_q.enums.TicketStatus;
import com.example.smart_q.model.QueueTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface QueueTicketRepository extends JpaRepository<QueueTicket, Long> {

    // Find all tickets with specific status
    List<QueueTicket> findByStatusOrderByTicketNumberAsc(TicketStatus status);

    // Find all waiting tickets (ordered by creation time)
    List<QueueTicket> findByStatusOrderByCreatedAtAsc(TicketStatus status);

    // ✅ NEW: Get the last ticket created today (for auto-increment)
    Optional<QueueTicket> findTopByCreatedAtBetweenOrderByTicketNumberDesc(
            LocalDateTime start,
            LocalDateTime end
    );

    // Find first waiting ticket (for "call next")
    Optional<QueueTicket> findFirstByStatusOrderByCreatedAtAsc(TicketStatus status);

    // Find currently serving ticket
    Optional<QueueTicket> findByStatus(TicketStatus status);

    // Count waiting tickets (for position calculation)
    long countByStatus(TicketStatus status);

    // Find user's active ticket (WAITING or SERVING)
    @Query("SELECT t FROM QueueTicket t WHERE t.user.id = :userId AND t.status IN ('WAITING', 'SERVING') ORDER BY t.createdAt DESC")
    Optional<QueueTicket> findActiveTicketByUserId(Long userId);
}
