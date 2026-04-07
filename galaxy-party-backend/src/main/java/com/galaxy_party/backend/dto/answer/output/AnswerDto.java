package com.galaxy_party.backend.dto.answer.output;

import lombok.Builder;

import java.util.UUID;

@Builder
public class AnswerDto {
    private UUID id;
    private String answer;
}
