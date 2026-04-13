ALTER TABLE answers
    ADD COLUMN question_id UUID;

ALTER TABLE answers
    ADD CONSTRAINT fk_answers_question
        FOREIGN KEY (question_id)
            REFERENCES questions (id)
            ON DELETE CASCADE;

CREATE INDEX idx_answers_question_id
    ON answers(question_id);