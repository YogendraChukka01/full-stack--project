package com.surplusfood.platform.controller;

import com.surplusfood.platform.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @GetMapping("/users/me")
    public ApiResponse<Map<String, String>> currentUser() {
        return ApiResponse.success(Map.of("role", "DONOR", "status", "active"), "Current user profile loaded");
    }
}
