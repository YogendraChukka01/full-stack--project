package com.surplusfood.platform.controller;

import com.surplusfood.platform.dto.ApiResponse;
import com.surplusfood.platform.dto.UserProfileRequest;
import com.surplusfood.platform.model.User;
import com.surplusfood.platform.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/sync-profile")
    public ApiResponse<User> syncProfile(
            Authentication authentication,
            @Valid @RequestBody UserProfileRequest request) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Authenticated Firebase user is required");
        }

        String firebaseUid = authentication.getName();
        User user = userService.findOrCreateByFirebaseUid(firebaseUid, request.email());
        user.setName(request.name());
        user.setPhone(request.phone());

        return ApiResponse.success(user, "Profile synced");
    }
}
