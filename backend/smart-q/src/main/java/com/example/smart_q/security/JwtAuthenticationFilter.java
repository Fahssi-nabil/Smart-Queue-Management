package com.example.smart_q.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;



@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            String authHeader = request.getHeader("Authorization");

            if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring(7);

            log.debug("Processing JWT token");

            if (jwtTokenProvider.validateToken(token)) {
                Claims claims = jwtTokenProvider.getClaims(token);
                // ✅ Extract USER ID (subject)
                String userId = claims.getSubject();

                // Extract roles
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                Object rolesObj = claims.get("roles");

                log.debug("Roles from token: {}", rolesObj);

                if (rolesObj instanceof String) {
                    String role = (String) rolesObj;
                    // ✅ Add ROLE_ prefix if not present
                    if (!role.startsWith("ROLE_")) {
                        role = "ROLE_" + role;
                    }
                    authorities.add(new SimpleGrantedAuthority(role));
                } else if (rolesObj instanceof List) {
                    List<String> roles = (List<String>) rolesObj;
                    authorities = roles.stream()
                            .map(role -> {
                                // ✅ Add ROLE_ prefix if not present
                                if (!role.startsWith("ROLE_")) {
                                    return "ROLE_" + role;
                                }
                                return role;
                            })
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());
                }

                log.debug("Authenticated user: {} with authorities: {}", userId, authorities);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userId, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }
}