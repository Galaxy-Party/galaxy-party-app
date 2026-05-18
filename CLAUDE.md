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
mvn clean spring-boot:run                   # Force full recompile then run
mvn test                                     # Run all tests
mvn clean package                            # Build JAR
```

### Frontend (React/Vite)
```bash
cd galaxy-party-frontend
npm run dev        # Dev server (port 5173)
npm run build      # Production build (includes tsc type check)
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
  │     └── REST calls (X-Service-Token) → Backend API
  └── Axios REST → Backend API (port 8080)
                     └── PostgreSQL (port 5432)
```

### Backend (Spring Boot)

Standard layered architecture: `Controller → Service → Repository → JPA/Hibernate`.

**Context path**: `server.servlet.context-path=/api` — all controllers are mapped **without** the `/api` prefix (e.g. `@RequestMapping("/rooms")` is accessible at `/api/rooms`).

**Entities**:
- `User` — username, email, passwordHash, imageName, room (ManyToOne)
- `Room` — name, password, ownerId, timer (Long, ms), users (OneToMany)
- `Question` — label, displayAnswer (human-readable answer for UI), answers (OneToMany)
- `Answer` — answer (normalized string for validation), question (ManyToOne)
- `Friendship` — requester (User), addressee (User), status (`PENDING`|`ACCEPTED`), createdAt
- `Message` — sender (User), receiver (User), content, createdAt, readAt
- `RefreshToken` — token (hashed UUID), user (ManyToOne)

**Flyway migrations** (`src/main/resources/db/migration/`, `V0.x.y__description.sql`):
- V0.1–V0.10: tables initiales (questions, users, rooms, answers, liaisons, imageName, roomName, password, ownerId)
- V0.11: fixtures questions/answers
- V0.12: timer room
- V0.13: displayAnswer sur questions
- V0.14: remplissage displayAnswer pour les fixtures
- V0.15: authentification (email, passwordHash, etc.)
- V0.16: table friendships
- V0.17: table messages

**REST endpoints** (all require auth — JWT cookie or `X-Service-Token`):
| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register + auto-login |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Rotate tokens |
| POST | `/auth/logout` | Revoke + clear cookies |
| GET | `/users/me` | Current user |
| PATCH | `/users/me` | Update imageName |
| GET | `/rooms` | List rooms |
| POST | `/rooms` | Create room |
| PUT | `/rooms/{id}` | Update timer/password |
| POST | `/rooms/join/{id}` | Join room |
| POST | `/rooms/leave/{id}` | Leave room |
| DELETE | `/rooms/{id}` | Delete room |
| GET | `/friendships?userId=` | Get all friendships for user |
| POST | `/friendships` | Create request (`requesterId` UUID + `addresseeUsername` String) |
| PUT | `/friendships/{id}/accept` | Accept |
| DELETE | `/friendships/{id}` | Decline/remove |
| GET | `/messages?between=&and=` | Conversation history |
| POST | `/messages` | Save message |
| GET | `/questions` | List questions |
| POST | `/ranked/result` | Soumettre résultat ranked (`winnerId`, `loserId`) → retourne `{ winnerElo, loserElo }` |
| GET | `/ranked/leaderboard` | Classement global |
| GET | `/ranked/definitions` | Définitions des rangs (nom, couleur, seuils ELO) |

**Auth**: Spring Security + JWT (HS256). `ServiceTokenFilter` → `JwtAuthFilter`. `/auth/**`, `/error`, and `OPTIONS` are public.

### Frontend (React)

**CSS**: Tailwind CSS v4 (`@import "tailwindcss"`). No inline styles in new components. `@theme { --font-display: 'Space Grotesk', sans-serif; }` defined in `index.css`. Use `font-display` class for Space Grotesk, `font-['DM_Sans',sans-serif]` is the global default. Custom animations (`nf`, `cardIn`, `fadeIn`, `spin`) in `index.css`.

**State**: `UserProvider` React Context. Auth hydrated via `GET /users/me` on mount; cookie-based.

**API client**: `src/api/client.ts` — fetch wrapper with `credentials: 'include'` and 401→refresh interceptor.

**Pages** (`src/pages/`):
- `LoginPage` — unified auth page with tab switch (Connexion / Créer un compte). Previously two separate pages; `RegisterPage` was deleted.
- `MenuPage`, `RulesPage`, `ProfilePage`, `RoomCreationPage`, `RoomListPage`
- `RankedPage` — hub classé (leaderboard, bouton "Jouer en Classé")
- `MatchmakingPage` — file d'attente classée avec countdown pré-match. Navigue vers GamePage avec `{ state: { isRanked: true } }` pour signaler une partie classée.
- `rooms/WaitingRoomPage` — room lobby with settings (timer slider, public/private toggle)
- `rooms/GamePage` — real-time quiz game. Lit `location.state?.isRanked` pour initialiser le mode classé (ne pas dépendre de `ranked:session_started` qui arrive avant le montage du composant).

**Components** (`src/components/`):
- `FriendsPanel` — slide-in panel (340px from right). Split into sub-components:
  - `friends/FriendAvatar.tsx` — avatar with placeholder SVG
  - `friends/FriendRow.tsx` — friend row with status dot, action buttons, unread indicator
  - `friends/FriendRequestRow.tsx` — pending request with accept/decline
  - `friends/FriendChat.tsx` — mini-chat with message history and input
  - `friends/types.ts` — shared constants (STATUS_DOT, STATUS_TEXT, STATUS_LABEL) and ActiveChat interface
- `Starfield`, `ProtectedRoute`, `CatchAllRedirect`, `ReturnMenuModal`, `JoinRoomModal`

**Socket** (`src/socket/client.ts`): Socket.io with `withCredentials: true`, `autoConnect: false`.

**Hooks**: `useSocket(event, handler)` for typed socket subscriptions.

**Vite proxy** (dev): `/api` → backend `:8080`, `/ws` → websocket `:4000`.

### WebSocket Server (Node.js)

**Auth middleware** (`src/socket/auth.ts`): verifies `access_token` cookie JWT, sets `socket.data.userId`. All handlers derive user identity from `socket.data.userId` — never trust userId from payloads.

**Handlers** (`src/socket/handlers/`):
- `room.ts` — `room:create/get/get_all/join/leave/delete/update`. On join: broadcasts `ingame` status to friends. On leave: broadcasts `online` status.
- `game.ts` — `game:start/player_ready/answer/time_up/quit`. Timer (ms) passed from client on `game:start`, stored in `GameSession`, used to initialize `timeRemaining` per player. `displayAnswer` used as `correctAnswer` in results (fallback to `answers[0]`). `game:quit` est **async** et **await handleRankedEnd** avant d'ack — le frontend navigue dans le callback de l'ack pour garantir que la room est supprimée avant toute nouvelle recherche.
- `ranked.ts` — `ranked:join_queue/leave_queue/get_leaderboard`. `ranked:join_queue` est idempotent : appelle `dequeue(userId)` en premier (pas d'erreur si déjà en file). L'adversaire est dépilé **après** la création réussie de la room (pas avant) pour éviter qu'il reste bloqué en "Recherche…" si une étape intermédiaire échoue.
- `friend.ts` — `friend:request/accept/decline`, `message:send/get_history`. Exports `broadcastStatus` and `sendFriendList` used by index and room handlers.
- `hello.ts` — ping/pong

**On connection** (`src/socket/index.ts`): sends `friend:list` to the connecting user and broadcasts `online` status to all their accepted friends.

**On disconnect**: broadcasts `offline` status to friends, then handles room cleanup.

**Socket events** (Client → Server):
- `room:create/get/get_all/join/leave/delete/update`
- `game:start { roomId, timer }`, `game:player_ready`, `game:answer`, `game:time_up`, `game:quit`
- `ranked:join_queue`, `ranked:leave_queue`, `ranked:get_leaderboard`
- `friend:request(toUsername)`, `friend:accept(friendshipId)`, `friend:decline(friendshipId)`
- `message:send { toUserId, content }`, `message:get_history { withUserId }`

**Socket events** (Server → Client):
- `room:list/details/created/deleted/user_joined/user_left/owner_changed`
- `game:loading/countdown/started/question/answer_result/over/player_quit`
- `ranked:match_found { roomId, opponent }`, `ranked:session_started`, `ranked:elo_updated(newElo)`, `ranked:leaderboard`, `ranked:ranks`
- `friend:list { friends, requests }`, `friend:status(userId, status)`, `friend:requested(request)`
- `message:received(message)`

**Services** (`src/services/`): `room`, `user`, `game`, `friendship`, `message` — all call Backend via Axios with `X-Service-Token`.

**Store** (`src/store/game.store.ts`): in-memory `GameSession` (roomId, timer, questions, currentPlayerId, players Map with timeRemaining, readyPlayers Set).

### Auth Flow
1. `POST /auth/register` → auto-login, sets `access_token` + `refresh_token` cookies
2. `POST /auth/login` → sets cookies. Frontend may `PATCH /users/me` to update imageName.
3. `POST /auth/refresh` — rotates tokens. Triggered transparently by fetch wrapper on 401.
4. `POST /auth/logout` — revokes refresh token, clears cookies.

### Game Flow
1. Users create/join rooms via WebSocket (`room:*`)
2. Owner sets timer (60s–300s) and public/private mode in the waiting room
3. Owner starts game: timer value sent in `game:start`, stored in session
4. Questions shuffled randomly, served one at a time
5. Correct answer: turn switches to opponent (1s delay before next question)
6. Wrong answer / time up: same player keeps turn (2s delay)
7. Game ends when no questions remain or a player's timer hits 0
8. `displayAnswer` on Question is shown to both players on answer reveal

### Ranked Flow
1. `RankedPage` → bouton "Jouer en Classé" → `MatchmakingPage` (`/ranked/matchmaking`)
2. `MatchmakingPage` émet `ranked:join_queue` — idempotent, safe à appeler plusieurs fois
3. Quand un adversaire est trouvé : `ranked:match_found { roomId, opponent }` → countdown 3s → navigate vers `/rooms/:id/game` avec `{ state: { isRanked: true } }`
4. `GamePage` lit `location.state.isRanked` pour initialiser le mode classé (pas de dépendance à `ranked:session_started`)
5. En cas de quit : `game:quit` async côté serveur, navigate dans le callback de l'ack. Le joueur qui quitte perd l'elo via `handleRankedEnd` (winner = adversaire, loser = quitteur)
6. Fin de partie : `game:over` → `ranked:elo_updated` → overlay victoire/défaite → redirect auto vers `/ranked` après 4s
7. Timer ranked fixe : `RANKED_TIMER_MS = 150 000ms` (2min30) par joueur

### Friends & Messaging Flow
1. User connects → WS sends `friend:list` (accepted friends with online/ingame/offline status + pending requests)
2. Status updates pushed in real time: `online` on connect, `ingame` on room join, `offline` on disconnect
3. Friend request: `friend:request(username)` → backend creates PENDING friendship → target notified via `friend:requested`
4. Accept: `friend:accept(friendshipId)` → backend sets ACCEPTED → both users get refreshed `friend:list`
5. Chat: `message:send` → persisted in DB → delivered via `message:received` if target is online

## Environment Variables

| Service | File | Key Variables |
|---|---|---|
| Frontend | `.env` | `VITE_WS_URL` (empty in dev — uses Vite proxy) |
| WebSocket | `.env` | `API_URL=http://localhost:8080`, `JWT_SECRET` (base64, must match backend), `WS_SERVICE_TOKEN` |
| Backend | `application.yaml` defaults | `JWT_SECRET`, `WS_SERVICE_TOKEN`, `COOKIE_SECURE`, `COOKIE_SAME_SITE` |
| Database | `database/.env` | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` |

`JWT_SECRET` and `WS_SERVICE_TOKEN` must be identical on backend and WS server.

## Key Conventions

- **Controller paths**: never include `/api` — the context path adds it automatically.
- **New Java files**: always verify no BOM with `od -An -tx1 file | head -1`. If BOM present, rewrite with `printf`.
- **Tailwind**: use arbitrary values for custom colors/sizes. No inline styles in new components. Define shared animations/fonts in `index.css`.
- **Socket payloads**: never include `userId` — always read from `socket.data.userId`.
- **Friend status**: derived at runtime from socket state (`roomId` set → `ingame`, connected → `online`, no socket → `offline`). Never stored in DB.
- **Migrations**: always use the next available version number. Check existing files before creating a new migration.

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
