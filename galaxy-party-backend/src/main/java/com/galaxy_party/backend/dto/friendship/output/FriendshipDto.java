package com.galaxy_party.backend.dto.friendship.output;

import com.galaxy_party.backend.dto.user.output.UserDto;
import com.galaxy_party.backend.entity.FriendshipEntity;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Builder
@Data
public class FriendshipDto {
    private UUID id;
    private String status;
    private UserDto requester;
    private UserDto addressee;

    public static FriendshipDto from(FriendshipEntity e) {
        return FriendshipDto.builder()
                .id(e.getId())
                .status(e.getStatus())
                .requester(UserDto.builder()
                        .id(e.getRequester().getId())
                        .username(e.getRequester().getUsername())
                        .imageName(e.getRequester().getImageName())
                        .build())
                .addressee(UserDto.builder()
                        .id(e.getAddressee().getId())
                        .username(e.getAddressee().getUsername())
                        .imageName(e.getAddressee().getImageName())
                        .build())
                .build();
    }
}
