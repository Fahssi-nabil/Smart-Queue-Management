package com.example.smart_q.controller;


import com.example.smart_q.dto.ChangePasswordRequest;
import com.example.smart_q.dto.UpdateProfileRequest;
import com.example.smart_q.dto.UserProfileDTO;
import com.example.smart_q.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    /**
     * Get current user's profile
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileDTO> getMyProfile() {
        UserProfileDTO profile = profileService.getMyProfile();
        return ResponseEntity.ok(profile);
    }



    /**
     * Update current user's profile (name and email)
     */
    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileDTO> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        UserProfileDTO profile = profileService.updateProfile(request);
        return ResponseEntity.ok(profile);
    }

    /**
     * Change password
     */
    @PatchMapping("/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        profileService.changePassword(request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

}
