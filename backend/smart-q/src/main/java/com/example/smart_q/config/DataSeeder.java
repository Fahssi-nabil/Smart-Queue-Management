package com.example.smart_q.config;

import com.example.smart_q.model.Role;
import com.example.smart_q.model.User;
import com.example.smart_q.repository.RoleRepository;
import com.example.smart_q.repository.UserRepository;
import com.example.smart_q.service.RoleService;
import com.example.smart_q.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;


@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("=== Starting Data Seeding ===");

        // 1️⃣ Create ROLE_ADMIN
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> {
                    Role role = new Role(null, "ADMIN");
                    roleRepository.save(role);
                    log.info("✅ Created role: ADMIN");
                    return role;
                });

        // 2️⃣ Create ROLE_CUSTOMER
        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseGet(() -> {
                    Role role = new Role(null, "CUSTOMER");
                    roleRepository.save(role);
                    log.info("✅ Created role: CUSTOMER");
                    return role;
                });

        // 3️⃣ Create ONLY ONE ADMIN (stored in database)
        if (!userRepository.existsByEmail("admin@smartq.com")) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@smartq.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
            log.info("✅ ADMIN CREATED → Email: admin@smartq.com | Password: admin123");
        } else {
            log.info("ℹ️ Admin already exists: admin@smartq.com");
        }

        log.info("=== Data Seeding Completed ===");
    }
}