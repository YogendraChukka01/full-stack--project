package com.surplusfood.platform.config;

import com.surplusfood.platform.domain.DonationStatus;
import com.surplusfood.platform.model.Donation;
import com.surplusfood.platform.model.Organization;
import com.surplusfood.platform.model.User;
import com.surplusfood.platform.repository.DonationRepository;
import com.surplusfood.platform.repository.OrganizationRepository;
import com.surplusfood.platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;

@Configuration
@ConditionalOnProperty(prefix = "app.demo-data", name = "enabled", havingValue = "true")
public class DemoDataConfiguration {

    @Bean
    CommandLineRunner seedDemoData(UserRepository userRepository,
                                   OrganizationRepository organizationRepository,
                                   DonationRepository donationRepository) {
        return args -> {
            if (organizationRepository.count() > 0) {
                return;
            }

            User donorUser = userRepository.save(createUser("demo-donor", "Spice Terrace", "donor@nourishlink.local", User.Role.DONOR));
            User ngoUser = userRepository.save(createUser("demo-ngo", "Hope Shelter", "ngo@nourishlink.local", User.Role.NGO));

            Organization donor = organizationRepository.save(createOrganization(donorUser, "DONOR", "Spice Terrace Restaurant"));
            organizationRepository.save(createOrganization(ngoUser, "NGO", "Hope Shelter Home"));

            Donation donation = new Donation();
            donation.setDonorOrganization(donor);
            donation.setFoodType("Steamed rice, paneer curry and chapati");
            donation.setQuantityKg(24.0);
            donation.setServings(60);
            donation.setPreparedAt(Instant.now().minusSeconds(1800));
            donation.setBestBeforeAt(Instant.now().plusSeconds(14400));
            donation.setPickupAddress("Jubilee Hills Road 36, Hyderabad");
            donation.setPickupLatitude(donor.getLatitude());
            donation.setPickupLongitude(donor.getLongitude());
            donation.setCategory("Cooked Meal");
            donation.setAllergens("Contains Dairy");
            donation.setImages("[]");
            donation.setStatus(DonationStatus.AVAILABLE);
            donationRepository.save(donation);
        };
    }

    private User createUser(String firebaseUid, String name, String email, User.Role role) {
        User user = new User();
        user.setFirebaseUid(firebaseUid);
        user.setName(name);
        user.setPhone("+910000000000");
        user.setEmail(email);
        user.setRole(role);
        return user;
    }

    private Organization createOrganization(User user, String type, String name) {
        Organization organization = new Organization();
        organization.setUser(user);
        organization.setType(type);
        organization.setName(name);
        organization.setAddress("Jubilee Hills, Hyderabad");
        organization.setLatitude(17.4316);
        organization.setLongitude(78.4071);
        organization.setIsVerified(true);
        return organization;
    }
}