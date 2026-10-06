# NourishLink
https://nourishlink-surplus-food-donation-platform.ai.studio/

NourishLink is a full-stack surplus food donation platform. The frontend is a React, TypeScript, and Vite application; the backend is a Java 17 and Spring Boot REST API.

## Project Layout

```text
backend/      Spring Boot application, REST API, persistence, and tests
frontend/     React application and typed API client
docs/         Product requirements and project specifications
```

The frontend API client is in `frontend/src/api`. It calls the backend's `/api` endpoints. In development, Vite proxies those requests to Spring Boot.

## Local Development

Prerequisites: Java 17, Maven, and Node.js 22 or newer.

Start the backend with development fixtures and the in-memory H2 database:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

In a second terminal, configure and start the frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open <http://localhost:3000>. The development profile creates donor organization ID `1`, NGO organization ID `2`, and one available sample donation. The frontend environment file uses those organization IDs by default.

Run checks from the repository root:

```bash
mvn -f backend/pom.xml test
cd frontend && npm run lint && npm run build
```

## Production Configuration

Authentication is required by default. Configure Firebase Admin credentials, set `app.firebase.enabled=true`, and provide `APP_CORS_ALLOWED_ORIGINS` for the deployed frontend origin. Do not enable the `dev` Spring profile or expose its unauthenticated API access in production.

Product requirements are in [docs/backend-prd.md](docs/backend-prd.md) and [docs/frontend-prd.md](docs/frontend-prd.md).

## Full-Stack Architecture

- Frontend: React 19 + TypeScript + Vite + Tailwind CSS
- Backend: Java 17 + Spring Boot 3 + Spring Web + Spring Data JPA + Hibernate
- Database: PostgreSQL in production; H2 is available for local development fixtures
- Authentication: Spring Security with Firebase Admin integration
- API style: REST under `/api`

## Core API

```text
GET    /api/public/health
GET    /api/donations
GET    /api/donations/{id}
POST   /api/donations?donorOrgId={id}
DELETE /api/donations/{id}
POST   /api/claims?donationId={id}&ngoOrgId={id}
```

The frontend proxies `/api` to the Spring Boot server in development. Keep secrets and production Firebase credentials outside the repository.

## Recommended Build Flow

PRD → UI/UX → database schema → REST contract → backend → API testing → frontend integration → authentication → validation/error states → tests → deployment.
