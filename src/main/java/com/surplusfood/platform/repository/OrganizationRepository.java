package com.surplusfood.platform.repository;

import com.surplusfood.platform.model.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
}
