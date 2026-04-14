package com.galaxy_party.backend.dto.room.output;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Builder
@Data
public class RoomDto {
    private UUID id;
    private String name;
}
