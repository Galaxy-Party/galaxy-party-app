package com.galaxy_party.backend.dto.room.input;

import lombok.Data;

import java.util.UUID;

@Data
public class JoinRoomDto {
    private UUID userId;
    private String password;
}
