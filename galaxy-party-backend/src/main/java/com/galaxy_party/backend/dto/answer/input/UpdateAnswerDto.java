package com.galaxy_party.backend.dto.answer.input;

import com.galaxy_party.backend.entity.AnswerEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UpdateAnswerDto {
    @NotNull
    private UUID id;
    private String answer;

    public static AnswerEntity toAnswerEntity(UpdateAnswerDto updateAnswerDto) {
        return AnswerEntity.builder()
                .id(updateAnswerDto.getId())
                .answer(updateAnswerDto.getAnswer())
                .build();
    }
}
