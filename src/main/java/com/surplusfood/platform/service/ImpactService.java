package com.surplusfood.platform.service;

import com.surplusfood.platform.model.ImpactMetric;
import com.surplusfood.platform.repository.ImpactMetricRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ImpactService {

    private final ImpactMetricRepository impactMetricRepository;

    public ImpactService(ImpactMetricRepository impactMetricRepository) {
        this.impactMetricRepository = impactMetricRepository;
    }

    @Transactional(readOnly = true)
    public List<ImpactMetric> findAll() {
        return impactMetricRepository.findAll();
    }
}
