# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Galaxy Party is a real-time multiplayer quiz game with a monorepo containing three independent services:

- **`galaxy-party-backend/`** — Spring Boot (Java 25) REST API
- **`galaxy-party-frontend/`** — React 19 + TypeScript + Vite SPA
- **`galaxy-party-websocket/`** — Node.js + Socket.io real-time server

## Development Commands

### Backend (Spring Boot)
```bash
cd galaxy-party-backend
mvn spring-boot:run                          # Run locally (port 8080)
mvn test                                     # Run all tests
mvn test -Dtest=ClassName                    # Run a single test class
mvn test -Dtest=ClassName#methodName         # Run a single test method
mvn clean package                            # Build JAR
```

### Frontend (React/Vite)
```bash
cd galaxy-party-frontend
npm run dev        # Dev server (port 5173)
npm run build      # Production build (includes tsc type check)
npm run build:stg  # Staging build
npm run lint       # ESLint validation
```

### WebSocket Server (Node.js)
```bash
cd galaxy-party-websocket
npm run dev    # Dev with hot reload (tsx watch)
npm run build  # TypeScript compilation
npm start      # Run compiled dist/server.js
```

### Local Database
```bash
cd galaxy-party-backend/database
docker-compose up -d   # PostgreSQL on localhost:5432
```

## Architecture

### Request Flow
```
Frontend (React)
  ├── Socket.io → WebSocket Server (port 4000)
  │     └── REST calls → Backend API
  └── Axios REST → Backend API (port 8080)
                     └── PostgreSQL (port 5432)
```

### Backend (Spring Boot)
Standard layered architecture: `Controller → Service → Repository → JPA/Hibernate`.
- Entities: `User`, `Room`, `Question`, `Answer`, `RefreshToken`
- User-Room: Many-to-One; Question-Answer: One-to-Many; RefreshToken-User: Many-to-One
- Database migrations managed by Flyway (`src/main/resources/db/migration/`, versioned `V0.x.y__description.sql`)
- Spring profiles: `dev` (default), `stg`, `production` via `application-{profile}.yml`
- **Auth**: Spring Security 7 + JWT (HS256, JJWT 0.12.6), stateless. Access token (15 min) + refresh token (7 d, opaque UUID hashed in DB, rotated on refresh). Cookies are `HttpOnly`, `SameSite=Lax`, `Path=/`. BCrypt(12) for passwords.
- **Security filters** (`com.galaxy_party.backend.security`): `ServiceTokenFilter` (validates `X-Service-Token` for WS→Backend internal calls) → `JwtAuthFilter` (reads `access_token` cookie or `Authorization: Bearer`). `/auth/**` and `OPTIONS` are public; everything else requires auth.

### Frontend (React)
- **State**: `UserProvider` React Context. Auth state hydrated via `GET /users/me` on mount; cookie-based, no token in JS.
- **API client**: `src/api/client.ts` fetch wrapper with `credentials: 'include'` and a 401 interceptor that calls `/auth/refresh` once (single-flight) then retries.
- **Pages**: `src/pages/` — full route views (incl. `LoginPage`, `RegisterPage`, `ProfilePage`)
- **Components**: `src/components/` — reusable UI; `ProtectedRoute` redirects unauthenticated users to `/login`
- **Hooks**: `src/hooks/` — custom hooks
- **Socket**: `src/socket/client.ts` — Socket.io client (`withCredentials: true`, `autoConnect: false`); connects/disconnects from `UserContext` based on auth state
- **Types**: `src/types/` — shared TypeScript interfaces
- **Vite proxy** (dev): `/api` → backend `:8080`, `/ws` → websocket `:4000` (with `ws: true`) — keeps everything same-origin so cookies flow correctly

### WebSocket Server (Node.js)
- **Handlers**: `src/socket/handlers/` — Socket event handlers (`room`, `game`, `hello`, `disconnect`)
- **Auth middleware**: `src/socket/auth.ts` — parses `access_token` cookie from handshake, verifies JWT (HS256, secret base64-decoded to match backend), sets `socket.data.userId`. Handlers derive user identity from `socket.data.userId` (no userId in payloads).
- **Services**: `src/services/` — business logic, calls Backend REST API via Axios. Outbound axios sends `X-Service-Token` (from `WS_SERVICE_TOKEN`) so backend's `ServiceTokenFilter` accepts the request.
- **Store**: `src/store/game.store.ts` — in-memory game session state (active games, player timers, question index)
- **CORS**: Accepts `https://galaxy-party.fr` and `http://localhost:5173`, `credentials: true`
- **Socket path**: `/ws`

### Auth Flow
1. `POST /auth/register` (username, email, password, optional `imageName`) — auto-logs in, returns `UserDto` + sets cookies
2. `POST /auth/login` (emailOrUsername, password) — returns `UserDto` + sets cookies. Frontend may then `PATCH /users/me` to update `imageName` if user picked a new avatar.
3. `POST /auth/refresh` — reads refresh cookie, rotates it, returns new pair. Triggered transparently by the fetch wrapper on 401.
4. `POST /auth/logout` — revokes refresh token, clears cookies.

### Game Flow
1. Users create/join rooms (WebSocket events `room:*`); identity derived from JWT cookie, not payload
2. Room owner starts the game
3. Questions fetched from backend database
4. Players answer in real-time; scoring is based on time remaining
5. Game ends when all questions answered or no questions remain
6. Room owner transfers automatically on disconnect

## Environment Variables

| Service | File | Key Variables |
|---|---|---|
| Frontend | `.env` | `VITE_WS_URL` (empty in dev to use Vite proxy / same origin) |
| WebSocket | `.env` | `API_URL=http://localhost:8080`, `JWT_SECRET` (base64, **must match backend**), `WS_SERVICE_TOKEN` (must match backend) |
| Backend | env or `application.yaml` defaults | `JWT_SECRET` (base64), `WS_SERVICE_TOKEN`, `COOKIE_SECURE` (true in prod), `COOKIE_SAME_SITE` |
| Database | `database/.env` | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` |

`JWT_SECRET` and `WS_SERVICE_TOKEN` must be identical on backend and WS — they share signing/auth.

## CI/CD

GitHub Actions (`.github/workflows/build.yml`) runs on PR to `main`/`dev`:
- Backend: `mvn test` with `spring.profiles.active=test`
- Frontend: lint + build
- WebSocket: build

## Docker Deployment

```bash
# Staging (ports: backend 8081, websocket 4001)
docker-compose-v2 -f docker-compose.staging.yml -p staging up -d

# Production (ports: backend 8080, websocket 4000)
docker-compose-v2 -f docker-compose.prod.yml -p prod up -d
```