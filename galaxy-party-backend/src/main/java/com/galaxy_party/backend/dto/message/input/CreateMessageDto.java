package com.galaxy_party.backend.dto.message.input;

import lombok.Data;

import java.util.UUID;

@Data
public class CreateMessageDto {
    private UUID senderId;
    private UUID receiverId;
    private String content;
}
