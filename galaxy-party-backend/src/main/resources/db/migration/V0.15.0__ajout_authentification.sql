-- Wipe des données existantes (pas de mode invité, on repart de zéro)
DELETE FROM users;
DELETE FROM rooms;

-- Ajout des colonnes d'authentification sur users
ALTER TABLE users
    ADD COLUMN email VARCHAR(255) NOT NULL,
    ADD COLUMN password_hash VARCHAR(255) NOT NULL,
    ADD COLUMN email_verified_at TIMESTAMP NULL;

-- Username devient obligatoire et unique
ALTER TABLE users
    ALTER COLUMN username SET NOT NULL;

ALTER TABLE users
    ADD CONSTRAINT users_username_unique UNIQUE (username);

ALTER TABLE users
    ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Table des refresh tokens (opaques, hashés)
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
