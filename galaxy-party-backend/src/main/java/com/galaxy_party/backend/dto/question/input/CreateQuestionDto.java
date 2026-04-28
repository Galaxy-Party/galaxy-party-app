package com.galaxy_party.backend.dto.question.input;

import com.galaxy_party.backend.entity.QuestionEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateQuestionDto {
    @NotNull
    private String label;
    private String displayAnswer;

    public static QuestionEntity toQuestionEntity(CreateQuestionDto createQuestionDto) {
        return QuestionEntity.builder()
                .label(createQuestionDto.getLabel())
                .displayAnswer(createQuestionDto.getDisplayAnswer())
                .build();
    }
}
