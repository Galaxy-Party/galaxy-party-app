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

**CSS**: Tailwind CSS v4 (`@import "tailwindcss"`). No inline styles in new components. `@theme` in `index.css` is the **single source of truth** for colors (palette-named tokens: `--color-indigo`, `--color-rose`, `--color-amber`, `--color-emerald`, `--color-navy`, `--color-bg`, `--color-text`, `--color-text-dim`, `--color-border`, `--color-panel`, `--color-indigo-deep`, `--color-purple`, `--color-pink`, `--color-amber-deep`, `--color-purple-light`, `--color-danger`, `--color-silver`, `--color-bronze`) and the display font (`--font-display`). Use `font-display` class for Space Grotesk, `font-['DM_Sans',sans-serif]` is the global default. Custom animations (`nf`, `cardIn`, `fadeIn`, `spin`) in `index.css`.

**State**: `UserProvider` React Context. Auth hydrated via `GET /users/me` on mount; cookie-based. `UserProvider` écoute `profile:xp_updated` globalement (socket) → met à jour `user.xp` et `user.level` en temps réel. Méthodes exposées : `updateElo(newElo)`, `updateXp(xp, level)`.

**Contexts supplémentaires** :
- `RanksContext` / `RanksProvider` / `useRanks()` — liste des définitions de rangs, peuplée via socket `ranked:ranks` (émis à la connexion)
- `LevelsContext` / `LevelsProvider` / `useLevels()` — liste des définitions de niveaux, peuplée via socket `levels:definitions` (émis à la connexion)

**API client**: `src/api/client.ts` — fetch wrapper with `credentials: 'include'` and 401→refresh interceptor.

**Pages** — each page lives in its **own folder** `src/pages/<page>/<Page>Page.tsx`, with page-specific pieces under `<page>/components/`, `<page>/hooks/`, and `<page>/*.ts` (reducers, types, validation). Only `main.tsx` imports pages. Folders: `login`, `menu`, `roomCreation`, `roomList`, `ranked`, `matchmaking`, `waitingRoom`, `game`, `spectator`, `profile`.
- `login/` — unified auth (Connexion / Créer un compte tabs; `RegisterPage` was merged in). Components: `TextField`, `AvatarGrid`; `validation.ts`.
- `game/` — real-time quiz. **Logic lives in hooks/reducer, not the component**: `hooks/useGameSession` (socket subscriptions, the live clock + `time_up`, quit flow, ELO/XP rewards), `gameReducer.ts` (discrete protocol state via `useReducer`), `hooks/useTurnBanner`, `types.ts`. Components: `GameOverOverlay`, `TurnBanner`, `PlayerColumn`, `AnswerForm`. Reads `location.state?.isRanked`. Quit flow: `isQuittingRef`/`quitWinnerIdRef` (kept in the hook). `playerTimes` is `useState` (continuous clock), deliberately kept out of the reducer.
- `spectator/` — read-only spectator. Components: `SpectatorPlayer`, `SpectatorGameOverOverlay`.
- `waitingRoom/` — lobby (timer slider, public/private). Components: `PlayerSlot`, `RoomSettings`.
- `ranked/` — ranked hub (top-10 leaderboard, rank/ELO banner). Components: `RanksModal`, `RankBanner`, `LeaderboardRow`.
- `matchmaking/` — queue + pre-match countdown → navigates to game with `{ state: { isRanked: true } }`. Component: `AvatarSlot`.
- `roomList/` — components `RoomTab`, `AvailableRoomRow`, `InProgressRoomRow`.
- `profile/` — components `AvatarPickerModal`, `TitlePickerModal`, `ProfileIdentity`, `ProfileStats`, `EditDot`, `StatCard`; `profileStyles.ts` (`TitleColor`, `BADGE_STYLE`, `getTitleColor`).
- `menu/` (`MenuButton`), `roomCreation/`.

**Components** (`src/components/`, generic & reusable only):
- `CardHeader` — panel header: icon box + title + `accent` (`indigo`|`amber`) + optional `right` slot. The icon box sets `text-{accent}`; pass the SVG with `stroke="currentColor"`. Used by menu/roomCreation/roomList/ranked/profile.
- `Nebulae` — decorative blurred background blobs (prop `teal` adds the 3rd one).
- `QuestionCard`, `TurnTimer` — shared by game + spectator.
- `FriendsPanel` (+ `friends/`: `FriendAvatar`, `FriendRow`, `FriendRequestRow`, `FriendChat`, `types.ts`).
- `Starfield`, `ProtectedRoute`, `CatchAllRedirect`, `ReturnMenuModal`, `JoinRoomModal`, `RulesModal`, `GameInviteNotif`, `Toaster`.

**Utils** (`src/utils/`): `time.ts` (`formatTime`), `rank.ts` (`getRankInfo`, `getProgressToNext`, `RankDefinition`).

**AppLayout** (`src/layouts/AppLayout.tsx`) :
- Barre XP dans le header (badge niveau + barre indigo→rose + label XP/max) — mise à jour temps réel via `profile:xp_updated`
- Tag joueur (avatar + username) cliquable → navigue vers `/profile`
- Écoute `ranked:elo_updated` pour mettre à jour l'ELO dans le UserContext

**Socket** (`src/socket/client.ts`): Socket.io with `withCredentials: true`, `autoConnect: false`.

**Hooks**: shared hooks in `src/hooks/` (`useSocket(event, handler)` for typed socket subscriptions, `useUserContext`, `useLevels`, `useRanks`, `useToast`). **Page-specific hooks** go in `src/pages/<page>/hooks/`.

**Vite proxy** (dev): `/api` → backend `:8080`, `/ws` → websocket `:4000`.

### WebSocket Server (Node.js)

**Auth middleware** (`src/socket/auth.ts`): verifies `access_token` cookie JWT, sets `socket.data.userId`. All handlers derive user identity from `socket.data.userId` — never trust userId from payloads.

**Handlers** (`src/socket/handlers/`):
- `room.ts` — `room:create/get/get_all/join/leave/delete/update`. On join: broadcasts `ingame` status to friends. On leave: broadcasts `online` status.
- `game.ts` — `game:start/player_ready/answer/time_up/quit`. Timer (ms) passed from client on `game:start`, stored in `GameSession`, used to initialize `timeRemaining` per player. `displayAnswer` used as `correctAnswer` in results (fallback to `answers[0]`). `game:quit` est **async** : émet `game:player_quit { winnerId }` immédiatement, puis await `handleRankedEnd` (ranked) ou `deleteRoom` (casual) avant d'ack. La room est **toujours supprimée** au quit (ranked ET casual). En fin de partie non-classée : appelle `handleCasualEnd` (POST `/levels/game-result`) puis émet `profile:xp_updated` à chaque joueur.
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
- `game:loading/countdown/started/question/answer_result/over`
- `game:player_quit { winnerId: string | null }` — un joueur a quitté ; `winnerId` = id du gagnant (celui qui n'a pas quitté), null si indéterminé
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
5. En cas de quit (ranked) : `game:quit` async, serveur émet `game:player_quit { winnerId }` → `handleRankedEnd` → `ranked:elo_updated` + `profile:xp_updated` → ack. Le quitteur voit l'overlay défaite (ELO perdu + XP) via l'ack ; l'adversaire voit l'overlay victoire via `game:player_quit`. Les deux redirigent vers `/ranked` après 6s.
6. En cas de quit (casual) : même flux mais sans ELO, room détruite, les deux redirigent vers `/rooms`.
7. Fin de partie normale : `game:over` → `ranked:elo_updated` + `profile:xp_updated` → overlay victoire/défaite (ELO + XP) → redirect auto vers `/ranked` après 6s
8. Timer ranked fixe : `RANKED_TIMER_MS = 150 000ms` (2min30) par joueur


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
- **Tailwind**: No inline styles in new components — style via `className` utilities. **Never** declare per-file color constants (`const INDIGO = '#818cf8'`, `const NAVY = 'var(--color-navy)'`, etc.); colors come only from the `@theme` tokens in `index.css`. Use the token utilities directly in classes: `text-indigo`, `bg-navy`, `border-border`, `text-text-dim`, gradients `from-indigo-deep to-purple`, and the opacity modifier for alpha shades (`bg-indigo/15`, `text-text/72`, `border-rose/40`). Define shared animations/fonts in `index.css`.
- **No className constants**: never extract Tailwind class strings into a variable (`const INPUT = 'w-full bg-indigo/6 …'`, `const tabBtn = '…'`, `const ACTIVE_RING = '…'`, etc.) and never build class names by interpolation (`` `border-${accent}` ``). Write the utility classes **directly** in the `className` attribute, even if that means repeating them across sibling elements — that is the Tailwind-recommended way and keeps the styles co-located with the markup. If markup genuinely repeats, extract a small **component** (not a string constant). Dynamic/data-driven values that Tailwind cannot express (e.g. a color coming from API data) are the only case where an inline `style={{}}` is acceptable.
- **Frontend file structure**: a page = `src/pages/<page>/<Page>Page.tsx`. Components used by **one** page → `src/pages/<page>/components/`; **reusable** components → `src/components/`. Page-specific hooks → `src/pages/<page>/hooks/`; shared hooks → `src/hooks/`. Pure helpers → `src/utils/`. When the same component/markup is duplicated across pages, promote it to `src/components/` (e.g. `Nebulae`, `QuestionCard`, `TurnTimer`, `CardHeader`) rather than copy-pasting.
- **Keep pages thin (separate logic from presentation)**: a page component should mostly *render*. Move non-trivial logic (socket subscriptions, timers, multi-step flows, derived data) into **custom hooks** (`useGameSession`, `useTurnBanner`…). For cohesive event-driven state with several related fields, prefer a **`useReducer`** with typed actions (explicit, self-documenting transitions) over many scattered `useState`/`setX`. Continuous/side-effecting state (e.g. a per-second clock) may stay as local `useState` next to the reducer.
- **Explaining variables, not magic conditions**: name a condition/expression when it is **reused (≥2×)** or its meaning isn't obvious (`const isMyTurn = …`, `const isSearching = phase === 'searching'`). If it's used **once and is already clear**, inline it — don't add a single-use variable for its own sake. (This is about *value/boolean* variables — distinct from the banned className-string constants above, which are never allowed.)
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
