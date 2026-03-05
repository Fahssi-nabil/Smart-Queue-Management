package com.example.smart_q.security;

import com.example.smart_q.model.User;
import com.example.smart_q.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // ✅ Check if user is deleted
        if (user.getDeleted()) {
            throw new RuntimeException("This account has been deleted. Please contact support.");
        }


        // ✅ Check if user is blocked
        if (!user.getActive()) {
            throw new RuntimeException("Your account has been blocked. Please contact support.");
        }


        var authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName())) // ✅ role.getName() should return "ROLE_CUSTOMER"
                .collect(Collectors.toList());

        log.debug("Loading user: {} with authorities: {}", email, authorities);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
