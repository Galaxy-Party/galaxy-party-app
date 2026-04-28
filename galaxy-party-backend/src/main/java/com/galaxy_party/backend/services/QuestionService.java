package com.galaxy_party.backend.services;

import com.galaxy_party.backend.dto.question.input.CreateQuestionDto;
import com.galaxy_party.backend.dto.question.input.UpdateQuestionDto;
import com.galaxy_party.backend.entity.QuestionEntity;
import com.galaxy_party.backend.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionEntity createQuestion(CreateQuestionDto createQuestionDto) {
        return questionRepository.save(CreateQuestionDto.toQuestionEntity(createQuestionDto));
    }

    public QuestionEntity updateQuestion(UUID questionid, UpdateQuestionDto updateQuestionDto) {
        QuestionEntity questionEntity = questionRepository.findById(questionid)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        questionEntity.setLabel(updateQuestionDto.getLabel());

        return questionRepository.save(questionEntity);
    }

    public void deleteQuestion(UUID questionid) {
        questionRepository.deleteById(questionid);
    }

    public List<QuestionEntity> findAll() {
        return questionRepository.findAll();
    }
}
