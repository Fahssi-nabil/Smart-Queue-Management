package com.example.smart_q.security;

import com.example.smart_q.model.User;
import com.example.smart_q.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Component
@Slf4j
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final UserRepository userRepository;

    private final SecretKey key = Keys.hmacShaKeyFor(
            JwtSecret.SECRET.getBytes(StandardCharsets.UTF_8)
    );

    // ✅ Generate Token
    public String generateToken(Authentication authentication) {

          String email = authentication.getName();

        // ✅ Get user from database to extract ID
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Get  roles
        List<String> roles = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        Date now = new Date();
        Date expiry = new Date(now.getTime() + JwtSecret.EXPIRATION);

        log.info("Generating token for user ID: {} ({})", user.getId(), email);

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("roles", roles)
                .claim("email", email) // Optional: include email in claims
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key , Jwts.SIG.HS384)
                .compact();
    }

    /**
     * Extract all claims from token
     */
    public Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            log.error("Error extracting claims: {}", e.getMessage());
            throw e;
        }
    }


    /**
     * ✅ Extract USER ID from token
     */
    public Long extractUserId(String token) {
        String userIdStr = getClaims(token).getSubject();
        return Long.parseLong(userIdStr);
    }


    /**
     * Extract email from token (optional claim)
     */
    public String extractEmail(String token) {
        return getClaims(token).get("email", String.class);
    }

    // ✅ Extract Roles
    public List<String> extractRoles(String token) {
        Claims claims = getClaims(token);
        Object rolesObj = claims.get("roles");

        if (rolesObj instanceof String) {
            return List.of((String) rolesObj);
        } else if (rolesObj instanceof List) {
            return (List<String>) rolesObj;
        }

        return List.of();
    }

    /**
     * Validate token
     */
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (io.jsonwebtoken.security.SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            log.error("JWT validation error: {}", e.getMessage());
        }
        return false;
    }
}
