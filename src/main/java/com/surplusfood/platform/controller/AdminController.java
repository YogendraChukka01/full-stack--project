package com.surplusfood.platform.controller;

import com.surplusfood.platform.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/verification-queue")
    public ApiResponse<Map<String, String>> verificationQueue() {
        return ApiResponse.success(Map.of("status", "queue-open"), "Verification queue loaded");
    }
}
