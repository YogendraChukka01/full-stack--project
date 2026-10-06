Here’s a complete, hackathon-ready **Product Requirements Document (PRD) for the Frontend** of your Surplus Food Donation Platform, aligned with your Java 17 + Spring Boot backend.

***

# Product Requirements Document (PRD) – Frontend  
**Project:** Surplus Food Donation Platform  
**Version:** 1.0 (Hackathon)  
**Target Users:** Donors, NGOs/Charities, Volunteers/Drivers, Admins  
**Platform:** Web (primary), Mobile-responsive (must), Optional PWA  

***

## 1. Product Vision

Build a real-time, intuitive, and trustworthy web interface that enables donors to list surplus food, NGOs to discover and claim donations, volunteers to manage pickups/deliveries, and admins to oversee operations—minimizing food waste and maximizing social impact.

**One-line pitch:**  
“Rescue surplus food before it becomes waste, and connect it with people who need it—at the right place and right time.”

***

## 2. Goals and Non-Goals

**Goals:**
- Enable fast onboarding and verification for donors and NGOs.  
- Make creating and discovering donations simple and quick (under 2 minutes).  
- Provide clear, real-time status tracking for each donation.  
- Show transparent impact metrics to motivate participation.  
- Work well on low-end Android phones via mobile web.

**Non-Goals (for hackathon scope):**
- Native iOS/Android apps (mobile web is enough).  
- Complex multi-warehouse inventory systems.  
- Advanced ML-based demand forecasting.  
- Full-fledged logistics TMS with multi-stop optimization.

***

## 3. User Personas

**Donor (Restaurant/Hotel/Supermarket/Event Organizer/Individual)**  
- Needs: Quick way to post surplus food, see who will pick it up, ensure it reaches people in need.  
- Pain points: No time for calls/WhatsApp coordination; worries about food safety liability.

**NGO/Charity Coordinator**  
- Needs: Clear view of nearby available food, ability to claim quickly, track pickups and distributions.  
- Pain points: Uncertain availability, last-minute cancellations, limited volunteers.

**Volunteer/Driver**  
- Needs: Simple task list, pickup/drop details, navigation, proof-of-delivery capture.  
- Pain points: Confusing instructions, waiting at wrong locations, no route clarity.

**Admin/Platform Operator**  
- Needs: Verification workflow, dispute resolution, analytics, system health.  
- Pain points: Fake listings, unsafe food, poor data quality.

***

## 4. Information Architecture (Sitemap)

**Public Pages:**
- Landing Page  
- How It Works  
- For Donors  
- For NGOs  
- Login / Sign Up  

**Authenticated – Common:**
- Dashboard (role-specific)  
- Notifications  
- Profile & Settings  

**Donor:**
- Create Donation  
- My Donations (list + detail)  
- Organization Profile  

**NGO:**
- Nearby Donations (map + list)  
- My Claims  
- Distribution Records  
- Organization Profile  

**Volunteer:**
- My Tasks (pickups/deliveries)  
- Task Detail (with navigation + proof capture)  

**Admin:**
- Verification Queue (Donors/NGOs)  
- All Donations (admin view)  
- Impact Analytics  
- System Settings  

***

## 5. Core User Flows

### 5.1 Donor: Create & Track Donation

1. Sign up / Login → Verify phone/email.  
2. “Create Donation” → Fill form (food type, quantity, time, best-before, location, category, allergens, optional images).  
3. Submit → See “Donation Created” with status **Available**.  
4. View in **My Donations** list → Click to see detail and timeline.  
5. Receive notifications when NGO claims, picks up, delivers.  
6. Optionally view impact contributed (meals served, kg rescued).

### 5.2 NGO: Discover & Claim Donation

1. Sign up / Login → Submit documents for verification.  
2. On approval, access **Nearby Donations**.  
3. Filter by distance, urgency, quantity, category.  
4. Click donation → See details and “Claim” button.  
5. Claim → Assign volunteer/driver (optional in hackathon).  
6. Track claim status: Pending → Accepted → Picked Up → Delivered → Distributed.  
7. Record distribution (beneficiary count, meals served, optional photo).

### 5.3 Volunteer: Execute Pickup & Delivery

1. Login → See **My Tasks** (assigned claims).  
2. Open task → See donor location, NGO location, contact info, food details, special instructions.  
3. Tap “Start Pickup” → Navigate (open in Google Maps).  
4. On pickup, mark “Picked Up” → Optionally capture photo.  
5. Navigate to NGO/beneficiary → Mark “Delivered”.  
6. Submit proof (photo/OTP/signature) → Task completed.

### 5.4 Admin: Verify & Monitor

1. Login → See **Verification Queue**.  
2. Review donor/NGO documents → Approve/Reject with reason.  
3. Monitor **All Donations** for anomalies.  
4. View **Impact Analytics** (kg rescued, meals served, CO₂ avoided).  
5. Manage users, resolve disputes.

***

## 6. Functional Requirements (Frontend)

### 6.1 Authentication & Onboarding

- **FR-A1:** Email/phone + password sign-up; optional Google OAuth.  
- **FR-A2:** Role selection during signup (Donor, NGO, Volunteer).  
- **FR-A3:** OTP-based phone verification.  
- **FR-A4:** Document upload for NGO/Donor verification (PDF/JPG/PNG).  
- **FR-A5:** Password reset via email.

### 6.2 Donor Features

- **FR-D1:** Create donation with fields:  
  - Food type (text/dropdown)  
  - Quantity (kg, numeric)  
  - Servings (numeric, optional)  
  - Prepared at (datetime)  
  - Best before (datetime)  
  - Pickup address (text + map picker)  
  - Category (Cooked, Packaged, Raw, Bakery, etc.)  
  - Allergens (multi-select/tags)  
  - Images (optional, up to 3–5)  
- **FR-D2:** Edit/cancel donation if status = Available.  
- **FR-D3:** View **My Donations** with filters (status, date, urgency).  
- **FR-D4:** Donation detail page with timeline/events.  
- **FR-D5:** Basic impact summary for donor (total kg, meals, donations).

### 6.3 NGO Features

- **FR-N1:** **Nearby Donations** page with:  
  - List view (cards) and map view (markers).  
  - Filters: distance, urgency, quantity, category.  
  - Sort by: urgency, distance, quantity.  
- **FR-N2:** Donation detail with “Claim” action.  
- **FR-N3:** **My Claims** dashboard with statuses.  
- **FR-N4:** Assign volunteer (optional for hackathon).  
- **FR-N5:** Record distribution: beneficiary count, meals served, optional photo.  
- **FR-N6:** NGO impact dashboard (kg rescued, meals served, trends).

### 6.4 Volunteer Features

- **FR-V1:** **My Tasks** list (assigned claims).  
- **FR-V2:** Task detail with:  
  - Donor and NGO info, contacts.  
  - Food details and handling notes.  
  - Status timeline.  
  - “Open in Maps” buttons.  
- **FR-V3:** Update status: Start → Picked Up → Delivered.  
- **FR-V4:** Upload proof-of-delivery (photo/OTP/signature).

### 6.5 Admin Features

- **FR-AD1:** Verification queue with document preview.  
- **FR-AD2:** Approve/reject with comments.  
- **FR-AD3:** Global donations view with filters.  
- **FR-AD4:** Impact analytics dashboard (charts, tables).  
- **FR-AD5:** User management (search, block, edit roles).

### 6.6 Notifications (In-App + Email)

- **FR-NO1:** In-app notification center (list, mark as read).  
- **FR-NO2:** Real-time updates via WebSocket/SSE for status changes.  
- **FR-NO3:** Email notifications for key events (new donation, claim accepted, pickup reminder, delivery confirmation, expiry warning).

### 6.7 Impact & Transparency

- **FR-I1:** Public impact page (total kg rescued, meals served, CO₂ avoided, active donors/NGOs).  
- **FR-I2:** Role-specific impact dashboards.  
- **FR-I3:** Donation timeline visible to donor and NGO.

***

## 7. Non-Functional Requirements

- **NFR-1 (Performance):** Page load < 2s on 4G; list virtualization for 100+ items.  
- **NFR-2 (Responsiveness):** Mobile-first; works on 360px width screens.  
- **NFR-3 (Accessibility):** WCAG 2.1 AA basics (contrast, focus states, alt text).  
- **NFR-4 (Security):** Auth tokens stored securely; role-based UI gating; CSRF protection.  
- **NFR-5 (Reliability):** Graceful error states, retry options, offline-friendly PWA (optional).  
- **NFR-6 (Localization):** English + Telugu (i18n ready; at least English for hackathon).  
- **NFR-7 (SEO):** Landing page and public pages SEO-friendly (meta tags, semantic HTML).

***

## 8. UI/UX Guidelines

- **Design System:** Tailwind CSS + Headless UI or Material UI (MUI) or Ant Design.  
- **Color Palette:** Trustworthy and warm (greens for rescue/impact, oranges for urgency).  
- **Typography:** Clean sans-serif (Inter, Roboto, or system fonts).  
- **Components:** Reusable cards, modals, toasts, tables, forms, maps, timelines.  
- **Microcopy:** Clear, action-oriented labels (“Create Donation”, “Claim Now”, “Mark Picked Up”).  
- **Empty States:** Helpful CTAs (e.g., “No nearby donations yet. Check back soon.”).

***

## 9. API Integration Contract (Frontend ↔ Backend)

Base URL: `http://localhost:8080/api` (adjust for prod)

**Auth:**
- `POST /auth/register`  
- `POST /auth/login`  
- `POST /auth/refresh`  
- `POST /auth/logout`

**Donations:**
- `POST /donations` – create  
- `GET /donations` – list (with filters)  
- `GET /donations/{id}` – detail  
- `PUT /donations/{id}` – update  
- `DELETE /donations/{id}` – cancel  
- `GET /donations/{id}/match-ngos` – get matched NGOs

**Claims:**
- `POST /claims` – create claim  
- `GET /claims?ngoId=...` – list claims for NGO  
- `PUT /claims/{id}` – update status  
- `POST /claims/{id}/proof` – upload proof

**Organizations:**
- `GET /organizations?type=NGO&verified=true`  
- `GET /organizations/{id}`  
- `PUT /organizations/{id}`

**Users:**
- `GET /users/me`  
- `PUT /users/me`

**Notifications:**
- `GET /notifications`  
- `PUT /notifications/{id}/read`

**Impact:**
- `GET /impact/summary`  
- `GET /impact/donor/{id}`  
- `GET /impact/ngo/{id}`

**Admin:**
- `GET /admin/verification-queue`  
- `POST /admin/verify/{entityType}/{id}`  
- `GET /admin/donations`  

All responses: JSON. Use standard HTTP status codes. Handle 4xx/5xx with user-friendly error toasts.

***

## 10. Data Models (Frontend View Models)

**DonationDTO (frontend):**
```ts
{
  id: number;
  donorOrg: { id: number; name: string; address: string };
  foodType: string;
  quantityKg: number;
  servings?: number;
  preparedAt: string; // ISO
  bestBeforeAt: string; // ISO
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  category: string;
  allergens?: string;
  status: "AVAILABLE"|"CLAIMED"|"PICKED_UP"|"DELIVERED"|"DISTRIBUTED"|"CANCELLED"|"EXPIRED";
  images?: string[];
  createdAt: string;
  updatedAt: string;
}
```

**ClaimDTO:**
```ts
{
  id: number;
  donationId: number;
  ngoOrg: { id: number; name: string };
  volunteer?: { id: number; name: string; phone: string };
  status: "PENDING"|"ACCEPTED"|"IN_PROGRESS"|"COMPLETED"|"CANCELLED";
  scheduledPickupAt?: string;
  claimedAt: string;
}
```

**UserDTO, OrganizationDTO, NotificationDTO, ImpactSummaryDTO** similarly defined.

***

## 11. Frontend Tech Stack (Recommended)

- **Framework:** Next.js 14 (App Router) or React 18 + Vite  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS + Headless UI  
- **State:** React Query (TanStack Query) + Zustand/Context  
- **Forms:** React Hook Form + Zod  
- **Maps:** Mapbox GL JS or Google Maps JS  
- **Charts:** Recharts or Chart.js  
- **Notifications:** Sonner / React Toastify  
- **Auth:** JWT stored in httpOnly cookie or secure storage  
- **PWA:** next-pwa or Workbox (optional)

***

## 12. Page-wise Requirements (Wireframe-Level)

### 12.1 Landing Page

- Hero section with value prop + CTA (“Join as Donor”, “Join as NGO”).  
- How it works (3–4 steps).  
- Impact stats (live or static for hackathon).  
- Testimonials/partners (optional).  
- Footer with links.

### 12.2 Auth Pages

- Login: email/phone + password, “Forgot password?”  
- Signup: role selection, basic info, OTP verification.  
- Password reset flow.

### 12.3 Donor Dashboard

- Summary cards: Active donations, Total kg donated, Meals served.  
- “Create Donation” prominent button.  
- Recent donations list (status badges).  
- Notifications bell.

### 12.4 Create/Edit Donation Form

- Multi-step or single-page form with validation.  
- Map picker for location (click to set lat/lng).  
- Image upload (drag-drop).  
- Clear best-before guidance (tooltip).  
- Submit → Success toast + redirect to detail.

### 12.5 NGO: Nearby Donations

- Toggle List/Map view.  
- Filters bar (distance slider, urgency, category).  
- Donation cards: food type, quantity, urgency badge, distance, “View” button.  
- Map: markers colored by urgency.

### 12.6 Donation Detail (NGO/Donor/Volunteer views)

- Key info header (food type, quantity, best-before, status).  
- Timeline of events.  
- Action buttons based on role and status (Claim, Edit, Cancel, Mark Picked Up, etc.).  
- Map preview with donor location.

### 12.7 Volunteer: My Tasks

- Task cards with status, donor/NGO names, time.  
- Task detail with navigation buttons and proof upload.

### 12.8 Impact Dashboard

- KPI cards: Kg rescued, Meals served, CO₂ avoided, Active participants.  
- Charts: Donations over time, Top categories, Geographic heat (optional).  
- Table: Recent donations with filters.

### 12.9 Admin: Verification Queue

- Table of pending donors/NGOs with documents preview.  
- Approve/Reject modal with reason field.

***

## 13. Validation & Error Handling

- Client-side validation for all forms (required fields, formats, min/max values).  
- Server error handling: show user-friendly messages, log technical details.  
- Network failure: retry button, offline indicator (if PWA).  
- Empty states with CTAs.

***

## 14. Security & Privacy (Frontend)

- Never expose admin endpoints or roles in client logic alone.  
- Sanitize all user-generated content before rendering (XSS protection).  
- Use HTTPS in production.  
- Mask sensitive data in UI (partial phone numbers, etc.).

***

## 15. Analytics & Telemetry (Optional but Useful)

- Track key events: donation_created, donation_claimed, pickup_completed, distribution_recorded.  
- Use Plausible / Umami / Google Analytics (privacy-friendly).  
- Error tracking via Sentry (optional).

***

## 16. Deliverables for Hackathon

- Fully functional responsive web app with:  
  - Auth (signup/login).  
  - Donor: create/view donations.  
  - NGO: view nearby, claim, record distribution.  
  - Volunteer: task list + status updates + proof upload.  
  - Admin: verification + impact dashboard.  
- Clean UI with consistent design system.  
- Real-time status updates (WebSocket/SSE or polling).  
- Demo data seeded for presentation.

***

## 17. Open Questions / Assumptions

- Assume Spring Boot backend exposes REST APIs as described.  
- Assume email/SMS providers are available for notifications.  
- Assume map provider API keys are available.  
- Telugu localization can be added post-hackathon if time is tight.

***

If you want, I can next generate a component inventory (file structure) and a copy-ready Next.js + Tailwind starter repo scaffold aligned to this PRD.
