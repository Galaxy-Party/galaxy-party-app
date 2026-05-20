package com.galaxy_party.backend.services;

import com.galaxy_party.backend.dto.message.input.CreateMessageDto;
import com.galaxy_party.backend.dto.message.output.MessageDto;
import com.galaxy_party.backend.entity.MessageEntity;
import com.galaxy_party.backend.entity.UserEntity;
import com.galaxy_party.backend.repository.MessageRepository;
import com.galaxy_party.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public List<MessageDto> getConversation(UUID a, UUID b) {
        return messageRepository.findConversation(a, b).stream()
                .map(MessageDto::from)
                .toList();
    }

    public MessageDto save(CreateMessageDto dto) {
        UserEntity sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        UserEntity receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        MessageEntity entity = MessageEntity.builder()
                .sender(sender)
                .receiver(receiver)
                .content(dto.getContent())
                .build();

        return MessageDto.from(messageRepository.save(entity));
    }
}
