package com.galaxy_party.backend.controller;

import com.galaxy_party.backend.dto.message.input.CreateMessageDto;
import com.galaxy_party.backend.dto.message.output.MessageDto;
import com.galaxy_party.backend.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<List<MessageDto>> getConversation(
            @RequestParam UUID between,
            @RequestParam UUID and) {
        return ResponseEntity.ok(messageService.getConversation(between, and));
    }

    @PostMapping
    public ResponseEntity<MessageDto> save(@RequestBody CreateMessageDto dto) {
        return new ResponseEntity<>(messageService.save(dto), HttpStatus.CREATED);
    }
}
