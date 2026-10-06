package com.surplusfood.platform.service;

import com.surplusfood.platform.model.Donation;
import com.surplusfood.platform.model.Organization;
import com.surplusfood.platform.util.LocationUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DonationMatchingService {

    public List<Organization> findMatchingNgos(Donation donation, List<Organization> organizations, double maxDistanceKm) {
        List<Organization> matches = new ArrayList<>();

        for (Organization organization : organizations) {
            double distance = LocationUtils.distanceKm(
                    donation.getPickupLatitude(),
                    donation.getPickupLongitude(),
                    organization.getLatitude(),
                    organization.getLongitude()
            );

            if (distance <= maxDistanceKm) {
                matches.add(organization);
            }
        }

        matches.sort(Comparator.comparingDouble(org -> LocationUtils.distanceKm(
                donation.getPickupLatitude(),
                donation.getPickupLongitude(),
                org.getLatitude(),
                org.getLongitude())));

        return matches;
    }
}
