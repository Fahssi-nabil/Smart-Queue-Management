package com.example.smart_q.repository;

import com.example.smart_q.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User , Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    /**
     * ✅ NEW: Find only non-deleted users
     */
    List<User> findAllByDeletedFalse();

    /**
     * ✅ NEW: Find user by ID only if not deleted
     */
    Optional<User> findByIdAndDeletedFalse(Long id);

}
