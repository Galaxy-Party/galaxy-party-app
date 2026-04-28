package com.galaxy_party.backend.dto.answer.input;

import com.galaxy_party.backend.entity.AnswerEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateAnswerDto {
    @NotNull
    private String answer;

    public static AnswerEntity toAnswerEntity(CreateAnswerDto createAnswerDto) {
        return AnswerEntity.builder()
                .answer(createAnswerDto.getAnswer())
                .build();
    }
}
