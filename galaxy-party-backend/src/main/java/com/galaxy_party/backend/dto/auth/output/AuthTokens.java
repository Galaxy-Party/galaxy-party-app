package com.galaxy_party.backend.dto.auth.output;

import com.galaxy_party.backend.entity.UserEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthTokens {
    private final String accessToken;
    private final String refreshToken;
    private final UserEntity user;
}
