package com.surplusfood.platform.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "impact_metrics")
public class ImpactMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;

    @Column(name = "metric_date", nullable = false)
    private LocalDate metricDate;

    @Column(name = "meals_served")
    private Integer mealsServed = 0;

    @Column(name = "kg_rescued")
    private Double kgRescued = 0.0;

    @Column(name = "beneficiaries_count")
    private Integer beneficiariesCount = 0;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public LocalDate getMetricDate() {
        return metricDate;
    }

    public void setMetricDate(LocalDate metricDate) {
        this.metricDate = metricDate;
    }

    public Integer getMealsServed() {
        return mealsServed;
    }

    public void setMealsServed(Integer mealsServed) {
        this.mealsServed = mealsServed;
    }

    public Double getKgRescued() {
        return kgRescued;
    }

    public void setKgRescued(Double kgRescued) {
        this.kgRescued = kgRescued;
    }

    public Integer getBeneficiariesCount() {
        return beneficiariesCount;
    }

    public void setBeneficiariesCount(Integer beneficiariesCount) {
        this.beneficiariesCount = beneficiariesCount;
    }
}
