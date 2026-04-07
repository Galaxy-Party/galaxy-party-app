package com.galaxy_party.backend.dto.user.input;

import com.galaxy_party.backend.entity.UserEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UpdateUserDto {
    @NotNull
    private UUID id;
    private String username;

    public static UserEntity toUserEntity(UpdateUserDto updateUserDto) {
        return UserEntity.builder()
                .id(updateUserDto.getId())
                .username(updateUserDto.getUsername())
                .build();
    }
}
