package com.galaxy_party.backend.dto.question.output;

import com.galaxy_party.backend.dto.answer.output.AnswerDto;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Builder
@Data
public class QuestionDto {

    private UUID id;
    private String label;
    private List<AnswerDto> answers;
}
