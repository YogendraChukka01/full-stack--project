package com.surplusfood.platform.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LocationUtilsTest {

    @Test
    void shouldReturnDistanceInKilometersForTwoCoordinates() {
        double distanceKm = LocationUtils.distanceKm(12.9716, 77.5946, 13.0524, 77.6503);

        assertThat(distanceKm).isBetween(10.0, 12.0);
    }
}
