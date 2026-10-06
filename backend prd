Below is a complete, hackathon-ready **Backend + Database PRD** for your Surplus Food Donation Platform, using:

- **Java 17**
- **Spring Boot 3**
- **PostgreSQL (with PostGIS) or MySQL**
- **Firebase Authentication** (instead of custom auth)

You can treat this as the “backend spec” counterpart to the frontend PRD.

***

# Product Requirements Document (PRD) – Backend & Database  
**Project:** Surplus Food Donation Platform  
**Version:** 1.0 (Hackathon)  
**Stack:** Java 17, Spring Boot 3, Spring Security + Firebase Admin SDK, JPA/Hibernate, PostgreSQL/MySQL  

***

## 1. System Overview

The backend provides REST APIs for:

- Firebase-based authentication and user profile management.  
- Donor, NGO, volunteer, and admin operations (donations, claims, tasks, impact).  
- Real-time notifications (via WebSocket/SSE or polling; push via FCM optional).  
- Impact analytics and reporting.  

The frontend (web/mobile) consumes these APIs and delegates authentication to Firebase.

***

## 2. Architecture

**High-Level Components:**

- **API Layer:** Spring Boot REST controllers (`/api/**`).  
- **Security Layer:** Spring Security + Firebase Admin SDK (JWT verification).  
- **Service Layer:** Business logic (matching, status transitions, impact calculation).  
- **Repository Layer:** Spring Data JPA repositories.  
- **Database:** PostgreSQL (preferred) or MySQL.  
- **Notifications:**  
  - In-app: stored in `notifications` table + optional WebSocket/SSE.  
  - Email: Spring Mail.  
  - Push (optional): Firebase Cloud Messaging (FCM).  

**Deployment:**

- Single Spring Boot service (monolith) for hackathon.  
- Config via environment variables.  
- Containerized with Docker; deployed on Render/Railway/Fly.io or VPS.

***

## 3. Authentication & Authorization (Firebase)

### 3.1 Authentication Flow

1. Frontend uses **Firebase Auth** (email/password, phone, or Google).  
2. On login, Firebase issues an **ID token (JWT)**.  
3. Frontend sends this token in `Authorization: Bearer <ID_TOKEN>` header.  
4. Backend verifies token using **Firebase Admin SDK**.  
5. On success, backend extracts `uid`, email, and custom claims (if any), then:  
   - Loads/creates corresponding `User` record in DB.  
   - Attaches authenticated user context to request (via `SecurityContext`).  

### 3.2 Backend Dependencies (Firebase Admin SDK)

Add to `pom.xml`:

```xml
<!-- Firebase Admin SDK -->
<dependency>
    <groupId>com.google.firebase</groupId>
    <artifactId>firebase-admin</artifactId>
    <version>9.2.0</version>
</dependency>
```

Initialize in a `@Configuration` class:

```java
@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        // Load service account JSON from classpath or env
        InputStream sa = new ClassPathResource("firebase-service-account.json").getInputStream();

        return FirebaseApp.initializeApp(
            FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(sa))
                .build()
        );
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}
```

### 3.3 JWT Filter & Security Config

**JwtAuthFilter.java (simplified):**

```java
public class JwtAuthFilter extends OncePerRequestFilter {

    private final FirebaseAuth firebaseAuth;
    private final UserService userService;

    public JwtAuthFilter(FirebaseAuth firebaseAuth, UserService userService) {
        this.firebaseAuth = firebaseAuth;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        try {
            FirebaseToken decoded = firebaseAuth.verifyIdToken(token);
            String firebaseUid = decoded.getUid();
            String email = decoded.getEmail();

            User user = userService.findOrCreateByFirebaseUid(firebaseUid, email);

            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                    user, null, user.getAuthorities()
                );
            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (FirebaseAuthException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
```

**SecurityConfig.java:**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

### 3.4 Roles & Claims

Use Firebase **custom claims** or a backend-managed role field:

- Roles: `DONOR`, `NGO`, `VOLUNTEER`, `ADMIN`.  
- Store role in `users.role` column.  
- Optionally set custom claims in Firebase on admin approval.

For hackathon, you can:

- Let frontend send role at signup.  
- Admin can later change roles via backend endpoint.

***

## 4. Database Schema

### 4.1 Choice of DB

- **PostgreSQL + PostGIS** (recommended for geo queries).  
- **MySQL 8** (fallback; implement distance in Java).

Below is PostgreSQL-focused; MySQL notes follow.

### 4.2 Core Tables (PostgreSQL)

```sql
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users (linked to Firebase UID)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(50) NOT NULL, -- DONOR, NGO, VOLUNTEER, ADMIN
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);

-- Organizations (Donors & NGOs)
CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- DONOR, NGO
    name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    documents JSONB,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PostGIS geometry for efficient geo queries
ALTER TABLE organizations ADD COLUMN geo geometry(POINT, 4326);
CREATE INDEX idx_org_geo ON organizations USING GIST (geo);

-- Donations
CREATE TABLE donations (
    id BIGSERIAL PRIMARY KEY,
    donor_org_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    food_type VARCHAR(100) NOT NULL,
    quantity_kg NUMERIC(10,2) NOT NULL,
    servings INTEGER,
    prepared_at TIMESTAMPTZ NOT NULL,
    best_before_at TIMESTAMPTZ NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_latitude DOUBLE PRECISION NOT NULL,
    pickup_longitude DOUBLE PRECISION NOT NULL,
    category VARCHAR(100),
    allergens TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    images JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE donations ADD COLUMN geo geometry(POINT, 4326);
CREATE INDEX idx_donation_geo ON donations USING GIST (geo);

-- Claims (NGO claiming a donation)
CREATE TABLE claims (
    id BIGSERIAL PRIMARY KEY,
    donation_id BIGINT NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    ngo_org_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    volunteer_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    scheduled_pickup_at TIMESTAMPTZ,
    claimed_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    proof_json JSONB -- photo URLs, OTP, signature, etc.
);

-- Events (audit/timeline for donations)
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    donation_id BIGINT NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- CREATED, CLAIMED, PICKED_UP, DELIVERED, DISTRIBUTED, CANCELLED, EXPIRED
    event_timestamp TIMESTAMPTZ DEFAULT NOW(),
    meta JSONB
);

-- Impact Metrics (per org per day)
CREATE TABLE impact_metrics (
    id BIGSERIAL PRIMARY KEY,
    org_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    meals_served INTEGER DEFAULT 0,
    kg_rescued NUMERIC(10,2) DEFAULT 0,
    beneficiaries_count INTEGER DEFAULT 0,
    UNIQUE (org_id, metric_date)
);

-- Notifications (in-app)
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    payload JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: FCM tokens for push notifications
CREATE TABLE fcm_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    device_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, token)
);
```

### 4.3 MySQL Adaptation Notes

- Replace `TIMESTAMPTZ` → `DATETIME`.  
- Replace `JSONB` → `JSON`.  
- Skip `geometry` columns; store `latitude`/`longitude` as `DOUBLE`.  
- Compute distances in Java using Haversine (already shown earlier).  

***

## 5. Domain Model (JPA Entities)

You already have basic entities; here are key adjustments for Firebase and extra fields.

### 5.1 User Entity

```java
@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "firebase_uid", nullable = false, unique = true)
    private String firebaseUid;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public enum Role { DONOR, NGO, VOLUNTEER, ADMIN }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
}
```

### 5.2 Organization, Donation, Claim

Extend earlier entities with:

- `Organization`: link to `User` via `user_id`; add `documents` (JSON string), `isVerified`.  
- `Donation`: add `images` (JSON string), `status` enum, timestamps.  
- `Claim`: add `proofJson` (JSON string) for photos/OTP/signature.

Use `@PreUpdate` listeners to maintain `updated_at`.

***

## 6. API Specification (REST)

Base path: `/api`

All authenticated endpoints require `Authorization: Bearer <Firebase-ID-Token>`.

### 6.1 Auth & Profile

- `POST /public/auth/sync-profile`  
  - Body: `{ name, phone, role }` (optional).  
  - Creates/updates `User` and default `Organization` if needed.  
- `GET /users/me` → `UserDTO` (+ linked orgs).  
- `PUT /users/me` → update profile.  
- `GET /users/me/organizations` → list orgs for user.  
- `POST /users/me/organizations` → create org (donor or NGO).  

### 6.2 Donations

- `POST /donations`  
  - Body: `CreateDonationRequest` (foodType, quantityKg, preparedAt, bestBeforeAt, pickupAddress, lat, lng, category, allergens, images).  
  - Creates donation with status `AVAILABLE`, emits `CREATED` event.  
- `GET /donations`  
  - Query params: `status`, `category`, `minQuantity`, `maxDistanceKm`, `lat`, `lng`, `sortBy`.  
  - Returns paginated list.  
- `GET /donations/{id}` → detail + events timeline.  
- `PUT /donations/{id}` → update if status allows.  
- `DELETE /donations/{id}` → cancel (set status `CANCELLED`, emit event).  
- `GET /donations/{id}/match-ngos` → list of matched NGOs (top K).  

### 6.3 Claims

- `POST /claims`  
  - Body: `{ donationId, ngoOrgId, volunteerUserId?, scheduledPickupAt? }`.  
  - Creates claim with status `PENDING`, updates donation status to `CLAIMED`.  
- `GET /claims`  
  - Query: `ngoOrgId`, `volunteerUserId`, `status`.  
- `GET /claims/{id}` → detail.  
- `PUT /claims/{id}` → update status (`ACCEPTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).  
- `POST /claims/{id}/proof`  
  - Body: `{ proofType: "PHOTO"|"OTP"|"SIGNATURE", data: {...} }`.  
  - Stores in `proof_json`, updates claim status to `COMPLETED` if delivery done.  

### 6.4 Organizations

- `GET /organizations`  
  - Query: `type`, `verified`, `lat`, `lng`, `maxDistanceKm`.  
- `GET /organizations/{id}` → detail.  
- `PUT /organizations/{id}` → update (name, address, docs).  

### 6.5 Notifications

- `GET /notifications` → list for authenticated user.  
- `PUT /notifications/{id}/read` → mark as read.  
- `POST /fcm-tokens` → register FCM token (body: `{ token, deviceInfo? }`).  

### 6.6 Impact

- `GET /impact/summary` → global stats.  
- `GET /impact/donor/{orgId}` → donor-specific metrics.  
- `GET /impact/ngo/{orgId}` → NGO-specific metrics.  

### 6.7 Admin

- `GET /admin/verification-queue` → list unverified donors/NGOs.  
- `POST /admin/verify`  
  - Body: `{ entityType: "DONOR"|"NGO", entityId: id, action: "APPROVE"|"REJECT", reason? }`.  
- `GET /admin/donations` → global donations with filters.  
- `GET /admin/users` → user list with role filters.  

***

## 7. Service Layer Logic

### 7.1 UserService (Firebase Integration)

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final FirebaseAuth firebaseAuth;

    @Transactional
    public User findOrCreateByFirebaseUid(String firebaseUid, String email) {
        return userRepo.findByFirebaseUid(firebaseUid)
            .orElseGet(() -> {
                User u = User.builder()
                    .firebaseUid(firebaseUid)
                    .email(email)
                    .name("User")
                    .phone("")
                    .role(User.Role.DONOR) // default, can be updated
                    .isVerified(false)
                    .build();
                return userRepo.save(u);
            });
    }
}
```

### 7.2 DonationService

- Create donation → persist, fire `CREATED` event, send notifications to nearby NGOs (optional).  
- Update/cancel → enforce business rules (cannot edit if claimed, etc.).  
- Compute urgency: time to `bestBeforeAt`.

### 7.3 DonationMatchingService

Already defined earlier; adapt to use `OrganizationRepository` and `Donation`.

For PostGIS, you can implement a native query to fetch NGOs within X km and then score them.

### 7.4 ClaimService

- Create claim → validate donation status, NGO eligibility.  
- Transition donation status: `AVAILABLE` → `CLAIMED`.  
- On claim completion → update donation to `DELIVERED`/`DISTRIBUTED`, record `completedAt`, update impact metrics.

### 7.5 ImpactService

- On distribution completion:  
  - Update `impact_metrics` for NGO (increment meals, kg, beneficiaries).  
  - Optionally update donor impact aggregation.  
- Provide summary endpoints.

### 7.6 NotificationService

- Create in-app notifications on key events:  
  - New donation near NGO.  
  - Donation claimed.  
  - Pickup scheduled.  
  - Delivery completed.  
  - Expiry warning (scheduled job).  
- Optionally send email and/or FCM push.

***

## 8. Background Jobs & Scheduled Tasks

Use Spring `@Scheduled`:

- **Expiry Checker:**  
  - Every 5–10 minutes, scan donations with `bestBeforeAt` passed and status still `AVAILABLE` or `CLAIMED`.  
  - Mark as `EXPIRED`, emit event, notify relevant users.  

- **Impact Aggregation (optional):**  
  - Nightly job to recompute daily metrics from events (if you prefer batch over real-time).

Example:

```java
@Component
@RequiredArgsConstructor
public class ExpiryJob {

    private final DonationRepository donationRepo;
    private final EventRepository eventRepo;

    @Scheduled(fixedRateString = "600000") // 10 min
    @Transactional
    public void markExpired() {
        Instant now = Instant.now();
        List<Donation> toExpire = donationRepo.findAvailableExpiringBefore(now);
        for (Donation d : toExpire) {
            d.setStatus(Donation.DonationStatus.EXPIRED);
            donationRepo.save(d);
            eventRepo.save(new Event(d, "EXPIRED", now, Map.of()));
        }
    }
}
```

***

## 9. Validation & Error Handling

- Use Bean Validation (`jakarta.validation`) on DTOs.  
- Global `@RestControllerAdvice` for consistent error responses:  
  - 400: validation errors.  
  - 401: invalid/missing token.  
  - 403: insufficient role/permissions.  
  - 404: resource not found.  
  - 409: business rule conflict (e.g., editing claimed donation).  
  - 500: unexpected server error.

***

## 10. Security & Compliance

- All endpoints except `/api/public/**` require valid Firebase ID token.  
- Role-based access control for admin endpoints.  
- Sanitize all user inputs; validate file types/sizes for uploads.  
- Use HTTPS in production.  
- Log security-relevant events (failed auth, unauthorized access attempts).

***

## 11. Logging, Monitoring, and Observability

- Use SLF4J + Logback.  
- Log request ID, user ID (firebase uid), endpoint, status, duration.  
- Integrate with Sentry or similar for error tracking (optional).  
- Expose `/actuator/health`, `/actuator/metrics` (Spring Boot Actuator).

***

## 12. Deployment Configuration

**Environment Variables:**

- `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`  
- `FIREBASE_SERVICE_ACCOUNT_JSON` (path or base64-encoded JSON)  
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`  
- `FCM_SERVER_KEY` (if using FCM directly)  
- `APP_BASE_URL` (for email links)

**Dockerfile (simplified):**

```dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/surplus-food-platform-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

***

## 13. Testing Strategy (Hackathon-Level)

- **Unit tests:** Services (matching, impact, expiry logic).  
- **Integration tests:** Repos + testcontainers (PostgreSQL).  
- **API tests:** MockMvc or REST-assured for key flows (create donation, claim, complete).  
- **Manual QA:** Postman collection for all endpoints.

***

## 14. File Uploads (Images & Proof)

Options:

1. **Cloud storage (recommended):**  
   - AWS S3 / Cloudflare R2 / GCS.  
   - Backend generates pre-signed upload URLs; frontend uploads directly.  
   - Store URLs in `images` / `proof_json`.

2. **Simple hackathon approach:**  
   - Accept multipart uploads in Spring Boot.  
   - Store files locally or in a mounted volume.  
   - Save relative paths/URLs in DB.

***

## 15. Real-Time Updates (Optional but Impressive)

- Use **WebSocket** (Spring WebSocket) or **SSE** to push:  
  - New donations to NGO dashboard.  
  - Status changes to donor/volunteer.  
- Fallback: frontend polling every 10–15 seconds.

***

## 16. Data Migration & Seed Data

- Provide SQL or Flyway/Liquibase migrations for schema.  
- Seed script to create:  
  - 1 admin user.  
  - 2–3 donor orgs.  
  - 2–3 NGOs.  
  - 5–10 sample donations with varied statuses.  

***

