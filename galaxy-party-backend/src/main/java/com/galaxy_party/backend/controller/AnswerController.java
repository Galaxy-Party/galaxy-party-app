package com.galaxy_party.backend.controller;

import com.galaxy_party.backend.dto.answer.input.CreateAnswerDto;
import com.galaxy_party.backend.dto.answer.input.UpdateAnswerDto;
import com.galaxy_party.backend.dto.answer.output.AnswerDto;
import com.galaxy_party.backend.entity.AnswerEntity;
import com.galaxy_party.backend.services.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<AnswerDto>> findAll() {
        return new ResponseEntity<>(answerService.findAll().stream().map(AnswerEntity::toAnswerDto).toList(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AnswerDto> createAnswer(@RequestBody CreateAnswerDto createAnswerDto) {
        return new ResponseEntity<>(AnswerEntity.toAnswerDto(answerService.createAnswer(createAnswerDto)), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AnswerDto> updateAnswer(@PathVariable UUID id, @RequestBody UpdateAnswerDto updateAnswerDto) {
        return new ResponseEntity<>(AnswerEntity.toAnswerDto(answerService.updateAnswer(id, updateAnswerDto)), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnswer(@PathVariable UUID id) {
        answerService.deleteAnswer(id);

        return ResponseEntity.noContent().build();
    }
}
