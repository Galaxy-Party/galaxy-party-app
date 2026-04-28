package com.galaxy_party.backend.services;

import com.galaxy_party.backend.dto.friendship.input.CreateFriendshipDto;
import com.galaxy_party.backend.dto.friendship.output.FriendshipDto;
import com.galaxy_party.backend.entity.FriendshipEntity;
import com.galaxy_party.backend.entity.UserEntity;
import com.galaxy_party.backend.repository.FriendshipRepository;
import com.galaxy_party.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public List<FriendshipDto> getFriendships(UUID userId) {
        return friendshipRepository.findAllByUserId(userId).stream()
                .map(FriendshipDto::from)
                .toList();
    }

    public FriendshipDto createRequest(CreateFriendshipDto dto) {
        UserEntity requester = userRepository.findById(dto.getRequesterId())
                .orElseThrow(() -> new RuntimeException("Requester not found"));
        UserEntity addressee = userRepository.findByUsername(dto.getAddresseeUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getAddresseeUsername()));

        friendshipRepository.findBetween(requester.getId(), addressee.getId())
                .ifPresent(f -> { throw new RuntimeException("Friendship already exists"); });

        FriendshipEntity entity = FriendshipEntity.builder()
                .requester(requester)
                .addressee(addressee)
                .build();

        return FriendshipDto.from(friendshipRepository.save(entity));
    }

    public FriendshipDto accept(UUID friendshipId) {
        FriendshipEntity entity = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));
        entity.setStatus("ACCEPTED");
        return FriendshipDto.from(friendshipRepository.save(entity));
    }

    public void delete(UUID friendshipId) {
        friendshipRepository.deleteById(friendshipId);
    }
}
