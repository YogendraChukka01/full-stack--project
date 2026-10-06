package com.surplusfood.platform.controller;

import com.surplusfood.platform.dto.ApiResponse;
import com.surplusfood.platform.dto.ClaimResponse;
import com.surplusfood.platform.service.ClaimService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping("/claims")
    public ApiResponse<ClaimResponse> createClaim(@RequestParam Long donationId,
                                                 @RequestParam Long ngoOrgId) {
        return ApiResponse.success(claimService.createClaim(donationId, ngoOrgId), "Claim created successfully");
    }
}
