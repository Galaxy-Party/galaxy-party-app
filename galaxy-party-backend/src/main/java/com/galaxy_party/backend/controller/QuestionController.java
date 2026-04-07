package com.galaxy_party.backend.controller;


import com.galaxy_party.backend.dto.question.input.CreateQuestionDto;
import com.galaxy_party.backend.dto.question.input.UpdateQuestionDto;
import com.galaxy_party.backend.entity.QuestionEntity;
import com.galaxy_party.backend.services.QuestionService;
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
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;


    @GetMapping
    public List<QuestionEntity> findAll() {
        return questionService.findAll();
    }

    @PostMapping
    public QuestionEntity createQuestion(@RequestBody CreateQuestionDto createQuestionDto) {
        return questionService.createQuestion(createQuestionDto);
    }

    @PatchMapping("/{id}")
    public QuestionEntity updateQuestion(@PathVariable UUID id, @RequestBody UpdateQuestionDto updateQuestionDto) {
        return questionService.updateQuestion(id, updateQuestionDto);
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable UUID id) {
        questionService.deleteQuestion(id);
    }


}
