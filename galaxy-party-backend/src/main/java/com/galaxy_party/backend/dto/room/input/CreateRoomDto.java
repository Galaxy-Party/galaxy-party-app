package com.galaxy_party.backend.dto.room.input;

import com.galaxy_party.backend.entity.RoomEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoomDto {
    private UUID id;
    private String name;
    private String password;
    private UUID ownerId;
    private Long timer;

    public static RoomEntity toRoomEntity(CreateRoomDto createRoomDto) {
        return RoomEntity.builder()
                .id(createRoomDto.getId())
                .name(createRoomDto.getName())
                .password(createRoomDto.getPassword())
                .ownerId(createRoomDto.getOwnerId())
                .timer(createRoomDto.getTimer())
                .build();
    }
}
