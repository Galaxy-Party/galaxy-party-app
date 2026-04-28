package com.galaxy_party.backend.dto.friendship.input;

import lombok.Data;

import java.util.UUID;

@Data
public class CreateFriendshipDto {
    private UUID requesterId;
    private String addresseeUsername;
}
