-- Ajouter la colonne si nécessaire
ALTER TABLE users
ADD COLUMN IF NOT EXISTS room_id UUID;

-- Autoriser NULL
ALTER TABLE users
ALTER COLUMN room_id DROP NOT NULL;

-- Supprimer ancienne FK
ALTER TABLE users
DROP CONSTRAINT IF EXISTS fk_users_room;

-- Ajouter FK avec ON DELETE SET NULL
ALTER TABLE users
ADD CONSTRAINT fk_users_room
FOREIGN KEY (room_id)
REFERENCES rooms(id)
ON DELETE SET NULL;