package com.galaxy_party.backend.dto.question.input;

import com.galaxy_party.backend.entity.QuestionEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UpdateQuestionDto {
    @NotNull
    private UUID id;
    private String label;

    public static QuestionEntity toQuestionEntity(UpdateQuestionDto updateQuestionDto) {
        return QuestionEntity.builder()
                .id(updateQuestionDto.getId())
                .label(updateQuestionDto.getLabel())
                .build();
    }
}
