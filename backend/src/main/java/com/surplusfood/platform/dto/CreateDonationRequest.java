package com.surplusfood.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record CreateDonationRequest(
        @NotBlank String foodType,
        @NotNull Double quantityKg,
        @NotNull Instant preparedAt,
        @NotNull Instant bestBeforeAt,
        @NotBlank String pickupAddress,
        @NotNull Double pickupLatitude,
        @NotNull Double pickupLongitude,
        Integer servings,
        String category,
        String allergens,
        String images
) {
}
