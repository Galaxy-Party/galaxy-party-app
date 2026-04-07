CREATE TABLE questions (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          label VARCHAR(255)
);