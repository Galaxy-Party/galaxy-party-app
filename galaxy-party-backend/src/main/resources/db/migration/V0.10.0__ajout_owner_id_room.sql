ALTER TABLE rooms
    ADD COLUMN owner_id UUID REFERENCES users(id);
