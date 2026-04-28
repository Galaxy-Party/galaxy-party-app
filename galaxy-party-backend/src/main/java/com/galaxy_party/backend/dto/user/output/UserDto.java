package com.galaxy_party.backend.dto.user.output;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Builder
@Data
public class UserDto {
    private UUID id;
    private String username;
    private String imageName;
}
