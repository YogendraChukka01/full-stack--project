package com.surplusfood.platform.service;

import com.surplusfood.platform.domain.ClaimStatus;
import com.surplusfood.platform.model.Claim;
import com.surplusfood.platform.model.Donation;
import com.surplusfood.platform.model.Organization;
import com.surplusfood.platform.repository.ClaimRepository;
import com.surplusfood.platform.repository.DonationRepository;
import com.surplusfood.platform.repository.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final DonationRepository donationRepository;
    private final OrganizationRepository organizationRepository;

    public ClaimService(ClaimRepository claimRepository,
                       DonationRepository donationRepository,
                       OrganizationRepository organizationRepository) {
        this.claimRepository = claimRepository;
        this.donationRepository = donationRepository;
        this.organizationRepository = organizationRepository;
    }

    @Transactional
    public Claim createClaim(Long donationId, Long ngoOrgId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new IllegalArgumentException("Donation not found"));
        Organization ngoOrg = organizationRepository.findById(ngoOrgId)
                .orElseThrow(() -> new IllegalArgumentException("NGO organization not found"));

        Claim claim = new Claim();
        claim.setDonation(donation);
        claim.setNgoOrganization(ngoOrg);
        claim.setStatus(ClaimStatus.PENDING);

        return claimRepository.save(claim);
    }
}
