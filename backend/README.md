# TMBC Backend

TypeScript + Express API powered by Prisma/PostgreSQL. It currently exposes the auth and invite workflows plus placeholder routes so the frontend can begin wiring screens.

## Getting Started

1. Install dependencies  
   ```bash
   npm install
   ```
2. Copy environment template and update values  
   ```bash
   cp .env.example .env
   ```
3. Start the development server (watches files with `ts-node-dev`)  
   ```bash
   npm run dev
   ```
   The API boots on `http://localhost:4000` and logs `TMBC backend running at http://localhost:4000`.

## Prisma & Database

- Update the schema in `prisma/schema.prisma`.
- Generate the Prisma client after any schema change:  
  `npm run prisma:generate`
- Apply migrations (requires `DATABASE_URL`):  
  `npm run prisma:migrate`
- Optional: inspect data with `npx prisma studio`.

## Environment Variables

| Key          | Description                                   |
| ------------ | --------------------------------------------- |
| `DATABASE_URL` | Connection string for PostgreSQL/Neon/etc.   |
| `JWT_SECRET` | Secret used to sign/verify JSON Web Tokens.   |
| `PORT`       | Port for the Express server (defaults to 4000). |

## API Outline

- `POST /api/auth/register` – register a new member with an invite code, returns `{ token, user }`.
- `POST /api/auth/login` – email/password login, returns `{ token, user }`.
- `POST /api/invite/generate` – admin/mentor protected invite generation with quota enforcement.
- `POST /api/invite/validate` – validate invite health.
- `POST /api/invite/consume` – consume invite + create user + return auth payload.
- `GET /api/{academy|registry|community|mentor|admin}` – placeholder JSON responses for frontend wiring.

All responses are JSON. Additional business logic (academy, registry, etc.) is intentionally deferred until requirements are finalized.
