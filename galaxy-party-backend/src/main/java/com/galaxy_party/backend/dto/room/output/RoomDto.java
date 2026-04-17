package com.galaxy_party.backend.dto.room.output;

import com.galaxy_party.backend.dto.user.output.UserDto;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Builder
@Data
public class RoomDto {
    private UUID id;
    private String name;
    private boolean hasPassword;
    private UUID ownerId;
    private List<UserDto> users;
}
