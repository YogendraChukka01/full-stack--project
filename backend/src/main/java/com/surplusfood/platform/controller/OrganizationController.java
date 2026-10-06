package com.surplusfood.platform.controller;

import com.surplusfood.platform.dto.ApiResponse;
import com.surplusfood.platform.model.Organization;
import com.surplusfood.platform.service.OrganizationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @GetMapping("/organizations")
    public ApiResponse<List<Organization>> getAllOrganizations() {
        return ApiResponse.success(organizationService.findAll(), "Organizations retrieved");
    }

    @GetMapping("/organizations/{id}")
    public ApiResponse<Organization> getOrganization(@PathVariable Long id) {
        return ApiResponse.success(organizationService.findById(id), "Organization found");
    }
}
