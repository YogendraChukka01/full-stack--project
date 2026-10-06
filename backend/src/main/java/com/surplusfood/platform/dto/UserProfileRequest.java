package com.surplusfood.platform.dto;

import jakarta.validation.constraints.NotBlank;

public record UserProfileRequest(
        @NotBlank String name,
        @NotBlank String phone,
        String role,
        String email
) {
}
