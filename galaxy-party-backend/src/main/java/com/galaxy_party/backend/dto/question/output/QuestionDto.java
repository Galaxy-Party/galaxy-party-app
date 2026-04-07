package com.galaxy_party.backend.dto.question.output;

import lombok.Builder;

import java.util.UUID;

@Builder
public class QuestionDto {

    private UUID id;
    private String label;
}
