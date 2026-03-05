package com.example.smart_q.service;

import com.example.smart_q.dto.AuthResponse;
import com.example.smart_q.dto.LoginRequest;
import com.example.smart_q.dto.RegisterRequest;
import com.example.smart_q.model.Role;
import com.example.smart_q.model.User;
import com.example.smart_q.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    /**
     * Register new user - Always assigns ROLE_CUSTOMER by default
     */
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userService.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // ✅ ALWAYS assign ROLE_CUSTOMER to new users
        Role customerRole = roleService.findOrCreateRole("CUSTOMER");
        user.setRoles(Set.of(customerRole));

        userService.save(user);

        log.info("New customer registered: {}", user.getEmail());

        return new AuthResponse(
                null,
                "Registration successful",
                user.getName(),
                user.getEmail(),
                "CUSTOMER"
        );
    }

    /**
     * Login user and return JWT token
     */
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(authentication);

        // Get user details
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRoles().iterator().next().getName();

        log.info("User logged in: {} with role: {}", user.getEmail(), role);

        return new AuthResponse(token, "Login successful", user.getName() , user.getEmail(), role);
    }


}
