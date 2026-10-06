package com.surplusfood.platform.controller;

import com.surplusfood.platform.dto.ApiResponse;
import com.surplusfood.platform.dto.UserProfileRequest;
import com.surplusfood.platform.model.User;
import com.surplusfood.platform.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/public/auth/sync-profile")
    public ApiResponse<User> syncProfile(@Valid @RequestBody UserProfileRequest request) {
        User user = userService.findOrCreateByFirebaseUid("demo-firebase-uid", request.email());
        user.setName(request.name());
        user.setPhone(request.phone());
        if (request.role() != null && !request.role().isBlank()) {
            user.setRole(User.Role.valueOf(request.role().toUpperCase()));
        }
        return ApiResponse.success(user, "Profile synced");
    }
}
