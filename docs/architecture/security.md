# Security Architecture

## Authentication

Firebase ID tokens are verified server-side by the Firebase Admin SDK.

The verified Firebase UID is the identity used by the backend.

## Authorization

Roles are server-controlled. A profile synchronization request cannot promote itself to ADMIN.

Administrative endpoints require:

ROLE_ADMIN

## Configuration

Secrets must be supplied through environment variables or a secret manager.

Never commit:

- Firebase service-account JSON
- database passwords
- API keys
- private tokens

## Production checklist

- Enable authentication.
- Restrict CORS to trusted frontend origins.
- Disable detailed actuator health output.
- Use HTTPS.
- Use PostgreSQL.
- Add rate limiting at the edge/API gateway.
- Audit sensitive organization and donation operations.
