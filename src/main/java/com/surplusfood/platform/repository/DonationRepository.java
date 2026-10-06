package com.surplusfood.platform.repository;

import com.surplusfood.platform.domain.DonationStatus;
import com.surplusfood.platform.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByStatus(DonationStatus status);
}
