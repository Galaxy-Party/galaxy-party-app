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
- `User` — username, email, passwordHash, imageName, room (ManyToOne), elo (int, default 0), wins (int, default 0), gamesPlayed (int, default 0), xp (int, default 0), level (int, default 1), equippedTitle (String nullable)
- `Room` — name, password, ownerId, timer (Long, ms), users (OneToMany)
- `Question` — label, displayAnswer (human-readable answer for UI), answers (OneToMany)
- `Answer` — answer (normalized string for validation), question (ManyToOne)
- `Friendship` — requester (User), addressee (User), status (`PENDING`|`ACCEPTED`), createdAt
- `Message` — sender (User), receiver (User), content, createdAt, readAt
- `RefreshToken` — token (hashed UUID), user (ManyToOne)
- `Rank` — name, icon, color, minElo, maxElo (nullable), next (nullable), displayOrder
- `Level` — levelNumber (PK), xpRequired, title

**Flyway migrations** (`src/main/resources/db/migration/`, `V0.x.y__description.sql`):
- V0.1–V0.10: tables initiales (questions, users, rooms, answers, liaisons, imageName, roomName, password, ownerId)
- V0.11: fixtures questions/answers
- V0.12: timer room
- V0.13: displayAnswer sur questions
- V0.14: remplissage displayAnswer pour les fixtures
- V0.15: authentification (email, passwordHash, etc.)
- V0.16: table friendships
- V0.17: table messages
- V0.18: colonne `elo` sur users (default 0)
- V0.19: table `ranks` (7 rangs : Bronze→Légende, avec icon, color, minElo, maxElo, next, displayOrder)
- V0.20: colonnes `wins`, `games_played`, `xp`, `level`, `equipped_title` sur users
- V0.21: table `levels` (level_number PK, xp_required, title)
- V0.22: fixtures 20 niveaux (Recrue → Ultime)

**REST endpoints** (all require auth — JWT cookie or `X-Service-Token`):
| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register + auto-login |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Rotate tokens |
| POST | `/auth/logout` | Revoke + clear cookies |
| GET | `/users/me` | Current user (inclut elo, wins, gamesPlayed, xp, level, equippedTitle) |
| PATCH | `/users/me` | Update username, imageName, equippedTitle |
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
| POST | `/ranked/result` | Résultat ranked (`winnerId`, `loserId`) → met à jour ELO + stats + XP → retourne `{ winnerElo, loserElo, winnerXp, winnerLevel, winnerLeveledUp, loserXp, loserLevel, loserLeveledUp }` |
| GET | `/ranked/leaderboard` | Classement global (top 10 par ELO) |
| GET | `/ranked/definitions` | Définitions des rangs (nom, couleur, seuils ELO) |
| GET | `/levels/definitions` | Définitions des 20 niveaux (levelNumber, xpRequired, title) |
| POST | `/levels/game-result` | Résultat casual (`winnerId`, `loserId`) → met à jour stats + XP (pas ELO) → retourne `GameXpResultDto` |

**Auth**: Spring Security + JWT (HS256). `ServiceTokenFilter` → `JwtAuthFilter`. `/auth/**`, `/error`, and `OPTIONS` are public.

### Frontend (React)

**CSS**: Tailwind CSS v4 (`@import "tailwindcss"`). No inline styles in new components. `@theme { --font-display: 'Space Grotesk', sans-serif; }` defined in `index.css`. Use `font-display` class for Space Grotesk, `font-['DM_Sans',sans-serif]` is the global default. Custom animations (`nf`, `cardIn`, `fadeIn`, `spin`) in `index.css`.

**State**: `UserProvider` React Context. Auth hydrated via `GET /users/me` on mount; cookie-based. `UserProvider` écoute `profile:xp_updated` globalement (socket) → met à jour `user.xp` et `user.level` en temps réel. Méthodes exposées : `updateElo(newElo)`, `updateXp(xp, level)`.

**Contexts supplémentaires** :
- `RanksContext` / `RanksProvider` / `useRanks()` — liste des définitions de rangs, peuplée via socket `ranked:ranks` (émis à la connexion)
- `LevelsContext` / `LevelsProvider` / `useLevels()` — liste des définitions de niveaux, peuplée via socket `levels:definitions` (émis à la connexion)

**API client**: `src/api/client.ts` — fetch wrapper with `credentials: 'include'` and 401→refresh interceptor.

**Pages** (`src/pages/`):
- `LoginPage` — unified auth page with tab switch (Connexion / Créer un compte). Previously two separate pages; `RegisterPage` was deleted.
- `MenuPage`, `RulesPage`, `RoomCreationPage`, `RoomListPage`
- `ProfilePage` — profil joueur : avatar (modal picker), titre équipé (modal picker parmi les titres débloqués), niveau + barre XP, stats (victoires/défaites/ratio/ELO/XP/niveau). Composants dans `src/components/profile/` : `AvatarPickerModal`, `TitlePickerModal`, `profileStyles.ts`.
- `RankedPage` — hub classé (leaderboard top 10, bannière rang+ELO+progression, bouton "Jouer en Classé")
- `MatchmakingPage` — file d'attente classée avec countdown pré-match. Navigue vers GamePage avec `{ state: { isRanked: true } }` pour signaler une partie classée.
- `rooms/WaitingRoomPage` — room lobby with settings (timer slider, public/private toggle)
- `rooms/GamePage` — real-time quiz game. Lit `location.state?.isRanked` pour initialiser le mode classé. Overlay de fin de game : en ranked → ELO + XP + barre progression ; en casual → XP + stats (victoires, défaites, ratio). Redirect auto vers `/ranked` après 6s si ranked.

**Components** (`src/components/`):
- `FriendsPanel` — slide-in panel (340px from right). Split into sub-components:
  - `friends/FriendAvatar.tsx` — avatar with placeholder SVG
  - `friends/FriendRow.tsx` — friend row with status dot, action buttons, unread indicator
  - `friends/FriendRequestRow.tsx` — pending request with accept/decline
  - `friends/FriendChat.tsx` — mini-chat with message history and input
  - `friends/types.ts` — shared constants (STATUS_DOT, STATUS_TEXT, STATUS_LABEL) and ActiveChat interface
- `profile/AvatarPickerModal.tsx` — modal de sélection d'avatar (grille 5 colonnes, bouton Sélectionner)
- `profile/TitlePickerModal.tsx` — modal de sélection de titre (liste scrollable, verrous sur niveaux non atteints)
- `profile/profileStyles.ts` — constantes partagées (couleurs, `TitleColor` union type, `BADGE_STYLE`, `getTitleColor`)
- `Starfield`, `ProtectedRoute`, `CatchAllRedirect`, `ReturnMenuModal`, `JoinRoomModal`

**AppLayout** (`src/layouts/AppLayout.tsx`) :
- Barre XP dans le header (badge niveau + barre indigo→rose + label XP/max) — mise à jour temps réel via `profile:xp_updated`
- Tag joueur (avatar + username) cliquable → navigue vers `/profile`
- Écoute `ranked:elo_updated` pour mettre à jour l'ELO dans le UserContext

**Socket** (`src/socket/client.ts`): Socket.io with `withCredentials: true`, `autoConnect: false`.

**Hooks**: `useSocket(event, handler)` for typed socket subscriptions.

**Vite proxy** (dev): `/api` → backend `:8080`, `/ws` → websocket `:4000`.

### WebSocket Server (Node.js)

**Auth middleware** (`src/socket/auth.ts`): verifies `access_token` cookie JWT, sets `socket.data.userId`. All handlers derive user identity from `socket.data.userId` — never trust userId from payloads.

**Handlers** (`src/socket/handlers/`):
- `room.ts` — `room:create/get/get_all/join/leave/delete/update`. On join: broadcasts `ingame` status to friends. On leave: broadcasts `online` status.
- `game.ts` — `game:start/player_ready/answer/time_up/quit`. Timer (ms) passed from client on `game:start`, stored in `GameSession`, used to initialize `timeRemaining` per player. `displayAnswer` used as `correctAnswer` in results (fallback to `answers[0]`). `game:quit` est **async** et **await handleRankedEnd** avant d'ack — le frontend navigue dans le callback de l'ack pour garantir que la room est supprimée avant toute nouvelle recherche. En fin de partie non-classée : appelle `handleCasualEnd` (POST `/levels/game-result`) puis émet `profile:xp_updated` à chaque joueur.
- `ranked.ts` — `ranked:join_queue/leave_queue/get_leaderboard`. `ranked:join_queue` est idempotent : appelle `dequeue(userId)` en premier (pas d'erreur si déjà en file). L'adversaire est dépilé **après** la création réussie de la room (pas avant) pour éviter qu'il reste bloqué en "Recherche…" si une étape intermédiaire échoue.
- `friend.ts` — `friend:request/accept/decline`, `message:send/get_history`. Exports `broadcastStatus` and `sendFriendList` used by index and room handlers.
- `hello.ts` — ping/pong

**On connection** (`src/socket/index.ts`): sends `friend:list` to the connecting user, broadcasts `online` status to friends, émet `ranked:ranks` (définitions des rangs) et `levels:definitions` (définitions des niveaux) au socket connecté.

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
- `ranked:match_found { roomId, opponent }`, `ranked:session_started`, `ranked:elo_updated(newElo)`, `ranked:leaderboard { entries, myElo }`, `ranked:ranks`
- `levels:definitions` — liste des 20 niveaux, émis à la connexion et mis en cache dans `LevelsContext`
- `profile:xp_updated { xp, level, leveledUp }` — émis après chaque fin de game (ranked ET casual) aux deux joueurs. Géré globalement dans `UserProvider` (met à jour `user.xp`/`user.level`).
- `friend:list { friends, requests }`, `friend:status(userId, status)`, `friend:requested(request)`
- `message:received(message)`

**Services** (`src/services/`): `room`, `user`, `game`, `friendship`, `message`, `ranked`, `level` — all call Backend via Axios with `X-Service-Token`. `ranked.service.ts` et `level.service.ts` ont un cache en mémoire pour les définitions de rangs/niveaux.

**Store** (`src/store/game.store.ts`): in-memory `GameSession` (roomId, timer, ranked: boolean, questions, currentPlayerId, players Map with timeRemaining, readyPlayers Set).

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
6. Fin de partie : `game:over` → `ranked:elo_updated` + `profile:xp_updated` → overlay victoire/défaite (ELO + XP) → redirect auto vers `/ranked` après 6s
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
- **New Java files**: always strip BOM with Python (Git Bash `sed` ne gère pas fiablement `\xef\xbb\xbf` sur Windows) :
  ```python
  python3 -c "
  f='path/to/File.java'
  d=open(f,'rb').read()
  open(f,'wb').write(d[3:] if d.startswith(b'\xef\xbb\xbf') else d)
  "
  ```
- **Tailwind**: use arbitrary values for custom colors/sizes. No inline styles in new components. Define shared animations/fonts in `index.css`.
- **Socket payloads**: never include `userId` — always read from `socket.data.userId`.
- **Friend status**: derived at runtime from socket state (`roomId` set → `ingame`, connected → `online`, no socket → `offline`). Never stored in DB.
- **Migrations**: always use the next available version number. Check existing files before creating a new migration. Prochaine version disponible : `V0.23`.
- **XP system**: victoire = +30 XP, défaite = +10 XP, pour les parties ranked ET casual. Level-up calculé automatiquement dans `LevelService.computeLevel(xp)` en comparant aux seuils de la table `levels`. Les titres s'obtiennent au fur et à mesure des niveaux (1 titre par niveau, couleurs par palier : indigo 1-4, emerald 5-8, rose 9-12, purple 13-16, gold 17-20).
- **ELO ranked** : algorithme ELO standard K=32. Seuil de matching : ±200 ELO, élargi à ±400 après 30s d'attente.

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
