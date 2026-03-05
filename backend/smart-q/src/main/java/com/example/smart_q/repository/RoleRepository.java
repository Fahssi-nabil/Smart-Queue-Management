package com.example.smart_q.repository;

import com.example.smart_q.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role , Long> {
    Optional<Role> findByName(String name);
    boolean existsByName(String name);
}
