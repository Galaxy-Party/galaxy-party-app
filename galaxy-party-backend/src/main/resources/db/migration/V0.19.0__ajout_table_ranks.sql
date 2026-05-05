CREATE TABLE ranks (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(50)  NOT NULL UNIQUE,
    icon         VARCHAR(10)  NOT NULL,
    color        VARCHAR(10)  NOT NULL,
    min_elo      INTEGER      NOT NULL,
    max_elo      INTEGER,
    next_rank    VARCHAR(50),
    display_order INTEGER     NOT NULL
);

INSERT INTO ranks (name, icon, color, min_elo, max_elo, next_rank, display_order) VALUES
('Bronze',  '🥉', '#cd7f32', 0,    99,   'Argent',   1),
('Argent',  '🥈', '#94a3b8', 100,  249,  'Or',       2),
('Or',      '🥇', '#fbbf24', 250,  449,  'Platine',  3),
('Platine', '🏆', '#34d399', 450,  699,  'Diamant',  4),
('Diamant', '💎', '#818cf8', 700,  999,  'Maître',   5),
('Maître',  '⭐', '#a78bfa', 1000, 1399, 'Légende',  6),
('Légende', '👑', '#f59e0b', 1400, NULL, NULL,       7);
