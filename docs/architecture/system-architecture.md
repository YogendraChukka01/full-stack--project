# NourishLink System Architecture

## Architecture style

NourishLink uses a modular monolith architecture:

- React + Vite frontend
- Spring Boot 3 backend
- PostgreSQL persistence
- Firebase Authentication
- REST API under /api/v1
- Feature-oriented backend modules
- CI validation through GitHub Actions

## Request flow

Browser
→ React application
→ /api/v1
→ Spring Security
→ Controller
→ Feature Service
→ Repository
→ PostgreSQL

Authentication:

Firebase
→ ID token
→ JwtAuthFilter
→ authenticated Spring Security principal
→ authorized controller/service operation

## Production principles

1. Never trust role data from the browser.
2. Never commit Firebase service-account credentials.
3. Use PostgreSQL in production.
4. Use migrations instead of create-drop schemas.
5. Keep controllers thin and business logic in services.
6. Return DTOs instead of exposing JPA entities directly.
7. Keep API contracts versioned.
