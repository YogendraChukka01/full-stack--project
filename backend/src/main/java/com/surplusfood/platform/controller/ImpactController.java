package com.surplusfood.platform.controller;

import com.surplusfood.platform.dto.ApiResponse;
import com.surplusfood.platform.model.ImpactMetric;
import com.surplusfood.platform.service.ImpactService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ImpactController {

    private final ImpactService impactService;

    public ImpactController(ImpactService impactService) {
        this.impactService = impactService;
    }

    @GetMapping("/impact")
    public ApiResponse<List<ImpactMetric>> getImpactSummary() {
        return ApiResponse.success(impactService.findAll(), "Impact metrics retrieved");
    }
}
