package com.surplusfood.platform.service;

import com.surplusfood.platform.domain.DonationStatus;
import com.surplusfood.platform.dto.CreateDonationRequest;
import com.surplusfood.platform.dto.DonationResponse;
import com.surplusfood.platform.exception.ResourceNotFoundException;
import com.surplusfood.platform.model.Donation;
import com.surplusfood.platform.model.Organization;
import com.surplusfood.platform.repository.DonationRepository;
import com.surplusfood.platform.repository.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final OrganizationRepository organizationRepository;

    public DonationService(DonationRepository donationRepository, OrganizationRepository organizationRepository) {
        this.donationRepository = donationRepository;
        this.organizationRepository = organizationRepository;
    }

    @Transactional
    public DonationResponse createDonation(Long donorOrgId, CreateDonationRequest request) {
        Organization donorOrg = organizationRepository.findById(donorOrgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        Donation donation = new Donation();
        donation.setDonorOrganization(donorOrg);
        donation.setFoodType(request.foodType());
        donation.setQuantityKg(request.quantityKg());
        donation.setPreparedAt(request.preparedAt());
        donation.setBestBeforeAt(request.bestBeforeAt());
        donation.setPickupAddress(request.pickupAddress());
        donation.setPickupLatitude(request.pickupLatitude());
        donation.setPickupLongitude(request.pickupLongitude());
        donation.setCategory(request.category());
        donation.setAllergens(request.allergens());
        donation.setImages(request.images());
        donation.setStatus(DonationStatus.AVAILABLE);

        Donation saved = donationRepository.save(donation);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<DonationResponse> findAll() {
        return donationRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public DonationResponse findById(Long donationId) {
        return donationRepository.findById(donationId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
    }

    @Transactional
    public DonationResponse cancelDonation(Long donationId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
        donation.setStatus(DonationStatus.CANCELLED);
        return mapToResponse(donationRepository.save(donation));
    }

    private DonationResponse mapToResponse(Donation donation) {
        return new DonationResponse(
                donation.getId(),
                donation.getFoodType(),
                donation.getQuantityKg(),
                donation.getPreparedAt(),
                donation.getBestBeforeAt(),
                donation.getPickupAddress(),
                donation.getPickupLatitude(),
                donation.getPickupLongitude(),
                donation.getStatus(),
                donation.getCategory(),
                donation.getAllergens(),
                donation.getImages()
        );
    }
}
