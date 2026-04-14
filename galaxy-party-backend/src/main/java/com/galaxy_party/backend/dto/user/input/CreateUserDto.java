package com.galaxy_party.backend.dto.user.input;

import com.galaxy_party.backend.entity.UserEntity;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserDto {
    @NotNull
    private String username;
    private String imageName;

    public static UserEntity toUserEntity(CreateUserDto createUserDto) {
        return UserEntity.builder()
                .username(createUserDto.getUsername())
                .imageName(createUserDto.getImageName())
                .build();
    }
}
