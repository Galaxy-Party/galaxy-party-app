package com.galaxy_party.backend.services;

import com.galaxy_party.backend.dto.answer.input.CreateAnswerDto;
import com.galaxy_party.backend.dto.answer.input.UpdateAnswerDto;
import com.galaxy_party.backend.entity.AnswerEntity;
import com.galaxy_party.backend.repository.AnswerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;

    public AnswerEntity createAnswer(CreateAnswerDto createAnswerDto) {
        return answerRepository.save(CreateAnswerDto.toAnswerEntity(createAnswerDto));
    }

    public AnswerEntity updateAnswer(UUID answerId, UpdateAnswerDto updateAnswerDto) {
        AnswerEntity answerEntity = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        answerEntity.setAnswer(updateAnswerDto.getAnswer());

        return answerRepository.save(answerEntity);
    }

    public void deleteAnswer(UUID answerId) {
        answerRepository.deleteById(answerId);
    }

    public List<AnswerEntity> findAll() {
        return answerRepository.findAll();
    }
}
