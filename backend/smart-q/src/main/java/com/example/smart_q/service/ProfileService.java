package com.example.smart_q.service;


import com.example.smart_q.dto.ChangePasswordRequest;
import com.example.smart_q.dto.UpdateProfileRequest;
import com.example.smart_q.dto.UserProfileDTO;
import com.example.smart_q.model.User;
import com.example.smart_q.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    /**
     * Get current authenticated user
     */
    private User getCurrentUser() {
        String userIdStr = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = Long.parseLong(userIdStr);
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }



    /**
     * Get current user's profile
     */
    public UserProfileDTO getMyProfile() {
        User user = getCurrentUser();
        String role = user.getRoles().iterator().next().getName();
        log.info("Profile retrieved for user: {}  ",  user.getId() ,  user.getEmail());
        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                role
        );
    }

    /**
     * ✅ Update profile - Works perfectly with User ID in token
     */
    @Transactional
    public UserProfileDTO updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();
        String oldEmail = user.getEmail();

        // Check if email is being changed
        boolean emailChanged = !request.getEmail().equalsIgnoreCase(oldEmail);

        // Validate email uniqueness if it's being changed
        if (emailChanged && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        // Update fields
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        User updatedUser = userRepository.save(user);

        if (emailChanged) {
            log.info("Profile updated - User ID: {} - Email changed from {} to {}",
                    user.getId(), oldEmail, request.getEmail());
        } else {
            log.info("Profile updated - User ID: {} - Name changed", user.getId());
        }

        String role = updatedUser.getRoles().iterator().next().getName();

        return new UserProfileDTO(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                role
        );
    }


    /**
     * Change password
     */
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Check if new password is same as current
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("New password must be different from current password");
        }

        // ✅ Verify passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New password and confirm password do not match");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for user: {}", user.getEmail());
    }


}