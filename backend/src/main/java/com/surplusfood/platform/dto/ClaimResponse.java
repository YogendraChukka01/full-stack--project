package com.surplusfood.platform.dto;

import com.surplusfood.platform.domain.ClaimStatus;

import java.time.Instant;

public record ClaimResponse(
        Long id,
        Long donationId,
        Long ngoOrganizationId,
        ClaimStatus status,
        Instant claimedAt
) {
}