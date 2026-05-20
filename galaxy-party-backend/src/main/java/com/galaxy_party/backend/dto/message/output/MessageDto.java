package com.galaxy_party.backend.dto.message.output;

import com.galaxy_party.backend.entity.MessageEntity;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Builder
@Data
public class MessageDto {
    private UUID id;
    private UUID senderId;
    private UUID receiverId;
    private String content;
    private Instant createdAt;
    private Instant readAt;

    public static MessageDto from(MessageEntity e) {
        return MessageDto.builder()
                .id(e.getId())
                .senderId(e.getSender().getId())
                .receiverId(e.getReceiver().getId())
                .content(e.getContent())
                .createdAt(e.getCreatedAt())
                .readAt(e.getReadAt())
                .build();
    }
}
