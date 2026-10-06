# NourishLink Frontend

React, TypeScript, and Vite frontend for the NourishLink platform. The app uses `src/api/client.ts` to communicate with the Spring Boot service under `/api`.

Run the backend first with the Spring `dev` profile, copy `.env.example` to `.env`, then run:

```bash
npm install
npm run dev
```

The local Vite server proxies `/api` to `http://localhost:8080`. Set `VITE_DONOR_ORG_ID` and `VITE_NGO_ORG_ID` to existing organization IDs when using a non-demo backend.
