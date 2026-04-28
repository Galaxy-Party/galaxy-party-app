package com.galaxy_party.backend.dto.answer.output;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Builder
@Data
public class AnswerDto {
    private UUID id;
    private String answer;
}
