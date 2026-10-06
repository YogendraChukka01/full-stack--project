package com.surplusfood.platform.repository;

import com.surplusfood.platform.model.ImpactMetric;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImpactMetricRepository extends JpaRepository<ImpactMetric, Long> {
}
