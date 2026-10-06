package com.surplusfood.platform.controller;

import com.surplusfood.platform.dto.ApiResponse;
import com.surplusfood.platform.dto.CreateDonationRequest;
import com.surplusfood.platform.dto.DonationResponse;
import com.surplusfood.platform.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping("/donations")
    public ApiResponse<DonationResponse> createDonation(@RequestParam Long donorOrgId,
                                                      @Valid @RequestBody CreateDonationRequest request) {
        return ApiResponse.success(donationService.createDonation(donorOrgId, request), "Donation created successfully");
    }

    @GetMapping("/donations")
    public ApiResponse<List<DonationResponse>> getDonations() {
        return ApiResponse.success(donationService.findAll(), "Donation list retrieved");
    }

    @GetMapping("/donations/{id}")
    public ApiResponse<DonationResponse> getDonation(@PathVariable Long id) {
        return ApiResponse.success(donationService.findById(id), "Donation found");
    }

    @DeleteMapping("/donations/{id}")
    public ApiResponse<DonationResponse> cancelDonation(@PathVariable Long id) {
        return ApiResponse.success(donationService.cancelDonation(id), "Donation cancelled");
    }
}
