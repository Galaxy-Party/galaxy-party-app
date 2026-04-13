package com.galaxy_party.backend.dto.question.output;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Builder
@Data
public class QuestionDto {

    private UUID id;
    private String label;
}
