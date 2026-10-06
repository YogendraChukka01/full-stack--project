package com.surplusfood.platform.model;

import com.surplusfood.platform.domain.ClaimStatus;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ngo_org_id", nullable = false)
    private Organization ngoOrganization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_user_id")
    private User volunteerUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status = ClaimStatus.PENDING;

    @Column(name = "scheduled_pickup_at")
    private Instant scheduledPickupAt;

    @Column(name = "claimed_at")
    private Instant claimedAt = Instant.now();

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "proof_json", columnDefinition = "TEXT")
    private String proofJson;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Donation getDonation() {
        return donation;
    }

    public void setDonation(Donation donation) {
        this.donation = donation;
    }

    public Organization getNgoOrganization() {
        return ngoOrganization;
    }

    public void setNgoOrganization(Organization ngoOrganization) {
        this.ngoOrganization = ngoOrganization;
    }

    public User getVolunteerUser() {
        return volunteerUser;
    }

    public void setVolunteerUser(User volunteerUser) {
        this.volunteerUser = volunteerUser;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public Instant getScheduledPickupAt() {
        return scheduledPickupAt;
    }

    public void setScheduledPickupAt(Instant scheduledPickupAt) {
        this.scheduledPickupAt = scheduledPickupAt;
    }

    public Instant getClaimedAt() {
        return claimedAt;
    }

    public void setClaimedAt(Instant claimedAt) {
        this.claimedAt = claimedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    public String getProofJson() {
        return proofJson;
    }

    public void setProofJson(String proofJson) {
        this.proofJson = proofJson;
    }
}
