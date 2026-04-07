package com.galaxy_party.backend.controller;

import com.galaxy_party.backend.dto.answer.input.CreateAnswerDto;
import com.galaxy_party.backend.dto.answer.input.UpdateAnswerDto;
import com.galaxy_party.backend.dto.answer.output.AnswerDto;
import com.galaxy_party.backend.entity.AnswerEntity;
import com.galaxy_party.backend.services.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/answers")
@RequiredArgsConstructor
public class AnswerController {
    private final AnswerService answerService;

    @GetMapping
    public List<AnswerDto> findAll() {
        return answerService.findAll().stream().map(AnswerEntity::toAnswerDto).toList();
    }

    @PostMapping
    public AnswerDto createAnswer(@RequestBody CreateAnswerDto createAnswerDto) {
        return AnswerEntity.toAnswerDto(answerService.createAnswer(createAnswerDto));
    }

    @PatchMapping("/{id}")
    public AnswerDto updateAnswer(@PathVariable UUID id, @RequestBody UpdateAnswerDto updateAnswerDto) {
        return AnswerEntity.toAnswerDto(answerService.updateAnswer(id, updateAnswerDto));
    }

    @DeleteMapping("/{id}")
    public void deleteAnswer(@PathVariable UUID id) {
        answerService.deleteAnswer(id);
    }
}
