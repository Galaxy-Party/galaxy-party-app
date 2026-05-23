# Galaxy Party

Jeu de quiz multijoueur 1v1 en temps réel. Deux joueurs s'affrontent sur une banque
de temps : une bonne réponse passe la main, une mauvaise (ou un silence) la garde —
le premier dont le chrono tombe à zéro perd. Modes **partie classique** et
**classé (ELO)**, avec niveaux/XP, titres à équiper, liste d'amis et chat en jeu.

## Stack technique

- **Backend** — Spring Boot 3 (Java 25), PostgreSQL via Flyway, auth JWT
- **Temps réel** — Node + Socket.io, authentification via le cookie JWT du backend
- **Frontend** — React 19 + TypeScript + Vite, Tailwind CSS v4

## Structure du monorepo

```
galaxy-party-backend/    API REST Spring Boot   (dev : http://localhost:8080, base path /api)
galaxy-party-websocket/  Serveur Node/Socket.io (dev : http://localhost:4000)
galaxy-party-frontend/   SPA React/Vite         (dev : http://localhost:5173)
docker-compose.staging.yml, docker-compose.prod.yml   Déploiement
```

En une phrase : la SPA parle REST au backend et Socket.io au serveur WS ; le serveur
WS rappelle le backend avec un service token partagé.

## Prérequis

- **Java 25** + **Maven**
- **Node.js 20+** + **npm**
- **Docker** + **Docker Compose**

## Lancer le projet en local

Il faut 4 choses qui tournent : PostgreSQL (Docker), le backend, le serveur WebSocket
et le serveur de dev Vite. Le plus simple : 4 terminaux.

### 1. PostgreSQL (Docker)

```bash
cd galaxy-party-backend/database
# Crée un .env (n'importe quelles valeurs conviennent en local) :
cat > .env <<'EOF'
POSTGRES_DB=galaxy_party
POSTGRES_USER=galaxy
POSTGRES_PASSWORD=galaxy
EOF
docker compose up -d
```

Postgres écoute maintenant sur `localhost:5432`. Les migrations Flyway sont
appliquées automatiquement au démarrage du backend — aucun setup manuel du schéma.

### 2. Backend (Spring Boot)

```bash
cd galaxy-party-backend
mvn spring-boot:run
```

Disponible sur `http://localhost:8080`. Tous les endpoints REST sont sous `/api`
(par ex. `POST /api/auth/login`). Les valeurs par défaut de `application.yaml`
suffisent pour le dev local.

> Les deux secrets **`JWT_SECRET`** et **`WS_SERVICE_TOKEN`** doivent être
> **identiques** entre le backend et le serveur WebSocket. Les valeurs par défaut
> correspondent déjà.

### 3. Serveur WebSocket (Node + Socket.io)

```bash
cd galaxy-party-websocket
# Crée un .env avec les valeurs qui correspondent à celles du backend :
cat > .env <<'EOF'
API_URL=http://localhost:8080
JWT_SECRET=<même valeur que le backend>
WS_SERVICE_TOKEN=<même valeur que le backend>
EOF
npm install
npm run dev
```

Disponible sur `http://localhost:4000`.

### 4. Frontend (React / Vite)

```bash
cd galaxy-party-frontend
# VITE_WS_URL vide → le proxy de dev Vite route /ws vers :4000 et /api vers :8080
cat > .env <<'EOF'
VITE_WS_URL=
EOF
npm install
npm run dev
```

Ouvre **http://localhost:5173** — crée un compte et lance un salon.

## Commandes disponibles par service

### Backend
| Commande | Rôle |
|---|---|
| `mvn spring-boot:run` | Serveur de dev (auto-reload via Spring DevTools) |
| `mvn test` | Tests (H2 + `spring.profiles.active=test`) |
| `mvn clean package` | Build du JAR |

### WebSocket
| Commande | Rôle |
|---|---|
| `npm run dev` | Dev avec hot reload (`tsx watch`) |
| `npm run build` | Compilation TypeScript vers `dist/` |
| `npm start` | Exécute `dist/server.js` compilé |

### Frontend
| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de dev Vite (port 5173, proxy `/api` et `/ws`) |
| `npm run build` | Build production (`tsc -b && vite build`) |
| `npm run build:stg` | Idem en mode `stg` |
| `npm run lint` | ESLint |

## Variables d'environnement — récapitulatif

| Service | Fichier | Clés requises |
|---|---|---|
| Base de données | `galaxy-party-backend/database/.env` | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` |
| Backend | `galaxy-party-backend/src/main/resources/application.yaml` | `JWT_SECRET`, `WS_SERVICE_TOKEN`, `COOKIE_SECURE`, `COOKIE_SAME_SITE` (valeurs par défaut OK en local) |
| WebSocket | `galaxy-party-websocket/.env` | `API_URL=http://localhost:8080`, `JWT_SECRET`, `WS_SERVICE_TOKEN` |
| Frontend | `galaxy-party-frontend/.env` | `VITE_WS_URL` (vide en dev — utilise le proxy Vite) |

**`JWT_SECRET` et `WS_SERVICE_TOKEN` doivent correspondre entre le backend et le
serveur WebSocket**, sinon le handshake WS échouera.

## Déploiement

```bash
# Staging — backend 8081, websocket 4001
docker-compose-v2 -f docker-compose.staging.yml -p staging up -d

# Production — backend 8080, websocket 4000
docker-compose-v2 -f docker-compose.prod.yml -p prod up -d
```

## CI

GitHub Actions tourne sur chaque PR vers `main`/`dev` (`.github/workflows/build.yml`) :
- Backend → `mvn test` avec `spring.profiles.active=test`
- Frontend → `npm run lint` + `npm run build`
- WebSocket → `npm run build`

## Conventions de code

Les conventions de dev (tokens Tailwind `@theme`, structure des dossiers de pages,
hooks pour la logique socket/état, etc.) sont documentées dans
[`CLAUDE.md`](./CLAUDE.md) — à lire avant de contribuer au frontend.
