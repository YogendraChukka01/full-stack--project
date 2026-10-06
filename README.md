# Surplus Food Platform Backend Starter

This repository contains a Spring Boot 3 starter aligned to the backend PRD for the surplus food donation platform.

## Included

- Java 17 + Spring Boot 3 project setup
- Firebase-ready security wiring with optional local bootstrap
- JPA user and organization entities
- Haversine distance utility for donor/NGO proximity logic
- Basic health endpoint and test coverage

## Ordered backend architecture

```text
src/main/java/com/surplusfood/platform/
├── SurplusFoodPlatformApplication.java
├── config/
│   ├── FirebaseConfig.java
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java
│   ├── AdminController.java
│   ├── ClaimController.java
│   ├── DonationController.java
│   ├── HealthController.java
│   ├── ImpactController.java
│   ├── NotificationController.java
│   ├── OrganizationController.java
│   └── UserController.java
├── domain/
│   ├── ClaimStatus.java
│   └── DonationStatus.java
├── dto/
│   ├── ApiResponse.java
│   ├── CreateDonationRequest.java
│   ├── DonationResponse.java
│   └── UserProfileRequest.java
├── exception/
│   ├── ApiExceptionHandler.java
│   └── ResourceNotFoundException.java
├── filter/
│   └── JwtAuthFilter.java
├── model/
│   ├── Claim.java
│   ├── Donation.java
│   ├── EventEntity.java
│   ├── ImpactMetric.java
│   ├── NotificationEntity.java
│   ├── Organization.java
│   └── User.java
├── repository/
│   ├── ClaimRepository.java
│   ├── DonationRepository.java
│   ├── EventRepository.java
│   ├── ImpactMetricRepository.java
│   ├── OrganizationRepository.java
│   └── UserRepository.java
├── service/
│   ├── ClaimService.java
│   ├── DonationMatchingService.java
│   ├── DonationService.java
│   ├── ImpactService.java
│   ├── NotificationService.java
│   ├── OrganizationService.java
│   └── UserService.java
├── util/
│   └── LocationUtils.java
└── resources/
    ├── application.properties
    └── db/
        └── schema-postgres.sql
```

## Run locally

```bash
mvn test
mvn spring-boot:run
```

## Firebase setup

To enable Firebase-backed auth, add:

```properties
app.firebase.enabled=true
FIREBASE_SERVICE_ACCOUNT_JSON=/absolute/path/to/serviceAccount.json
```

You can also place a service account JSON file at `src/main/resources/firebase-service-account.json`.

## Default local mode

The app starts without Firebase credentials by default so the backend can be built and tested locally. The JWT filter automatically skips authentication when Firebase is not configured.
