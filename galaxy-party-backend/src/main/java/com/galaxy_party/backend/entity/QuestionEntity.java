package com.galaxy_party.backend.entity;

import com.galaxy_party.backend.dto.question.output.QuestionDto;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "questions")
public class QuestionEntity {

    @Id
    @Column(updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String label;

    @OneToMany(
            mappedBy = "question",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<AnswerEntity> answers;

    public static QuestionDto toQuestionDto(QuestionEntity questionEntity) {
        return QuestionDto.builder()
                .id(questionEntity.getId())
                .label(questionEntity.getLabel())
                .answers(questionEntity.getAnswers().stream().map(AnswerEntity::toAnswerDto).toList())
                .build();
    }
}
