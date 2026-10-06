package com.surplusfood.platform.controller;

import com.surplusfood.platform.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class NotificationController {

    @GetMapping("/notifications")
    public ApiResponse<List<String>> notifications() {
        return ApiResponse.success(List.of("Donation created", "Claim accepted"), "Notifications retrieved");
    }
}
