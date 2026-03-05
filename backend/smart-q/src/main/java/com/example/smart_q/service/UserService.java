package com.example.smart_q.service;

import com.example.smart_q.dto.UserDTO;
import com.example.smart_q.enums.TicketStatus;
import com.example.smart_q.model.QueueTicket;
import com.example.smart_q.model.User;
import com.example.smart_q.repository.QueueTicketRepository;
import com.example.smart_q.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final QueueTicketRepository queueTicketRepository;


    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Get all NON-DELETED users
     */
    public List<UserDTO> getAllUsers() {
        return userRepository.findAllByDeletedFalse()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Block user
     */
    @Transactional
    public void blockUser(Long userId) {
        User user = userRepository.findByIdAndDeletedFalse(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found or already deleted"));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));

        if (isAdmin) {
            throw new IllegalStateException("Cannot block admin users");
        }

        user.setActive(false);
        userRepository.save(user);

        log.info("User blocked: {} (ID: {})", user.getEmail(), userId);
    }

    /**
     * Unblock user
     */
    @Transactional
    public void unblockUser(Long userId) {
        User user = userRepository.findByIdAndDeletedFalse(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found or already deleted"));

        user.setActive(true);
        userRepository.save(user);

        log.info("User unblocked: {} (ID: {})", user.getEmail(), userId);
    }

    /**
     * ✅ SIMPLE VERSION: Delete user + Cancel their ONE active ticket (if exists)
     */
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findByIdAndDeletedFalse(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found or already deleted"));

        // Prevent deleting admin accounts
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));

        if (isAdmin) {
            throw new IllegalStateException("Cannot delete admin users");
        }

        // ✅ STEP 1: Check if user has an ACTIVE ticket (WAITING or SERVING)
        Optional<QueueTicket> activeTicket = queueTicketRepository.findActiveTicketByUserId(userId);
         if(activeTicket.isPresent()){
             QueueTicket ticket = activeTicket.get();
             // Mark as SKIPPED
             ticket.setStatus(TicketStatus.SKIPPED);
             ticket.setCompletedAt(LocalDateTime.now());
             queueTicketRepository.save(ticket);
             log.info("Ticket #{} cancelled (status: {} → SKIPPED) due to user deletion",
                     ticket.getTicketNumber(), ticket.getStatus());
         }else {
             log.info("User has no active ticket to cancel");
         }

        // ✅ STEP 2: Soft delete user
        user.setDeleted(true);
        user.setDeletedAt(LocalDateTime.now());
        user.setActive(false);

        // ✅ STEP 3: Anonymize personal data
        user.setAnonymized(true);
        user.setName("Deleted User");
        user.setEmail("deleted_" + userId + "_" + UUID.randomUUID().toString().substring(0, 8) + "@deleted.local");
        user.setPassword("DELETED_ACCOUNT_" + UUID.randomUUID());

        userRepository.save(user);

        log.warn("User deleted and anonymized: ID {} - Original: '{}' <{}>",
                userId);

    }


    /**
     * Map User entity to UserDTO
     */
    private UserDTO mapToDTO(User user) {
        String role = user.getRoles().iterator().next().getName();

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                role,
                LocalDateTime.now(),
                user.getActive()
        );
    }

}
