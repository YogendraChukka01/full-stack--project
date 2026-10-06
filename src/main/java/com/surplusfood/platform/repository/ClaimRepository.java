package com.surplusfood.platform.repository;

import com.surplusfood.platform.domain.ClaimStatus;
import com.surplusfood.platform.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByStatus(ClaimStatus status);
}
