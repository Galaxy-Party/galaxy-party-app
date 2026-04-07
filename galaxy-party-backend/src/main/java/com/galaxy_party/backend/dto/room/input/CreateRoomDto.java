package com.galaxy_party.backend.dto.room.input;

import com.galaxy_party.backend.entity.RoomEntity;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CreateRoomDto {
    private UUID id;

    public static RoomEntity toRoomEntity(CreateRoomDto createRoomDto) {
        return RoomEntity.builder()
                .id(createRoomDto.getId())
                .build();
    }
}
