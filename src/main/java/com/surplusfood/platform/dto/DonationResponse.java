package com.surplusfood.platform.dto;

import com.surplusfood.platform.domain.DonationStatus;

import java.time.Instant;

public record DonationResponse(
        Long id,
        String foodType,
        Double quantityKg,
        Instant preparedAt,
        Instant bestBeforeAt,
        String pickupAddress,
        Double pickupLatitude,
        Double pickupLongitude,
        DonationStatus status,
        String category,
        String allergens,
        String images
) {
}
