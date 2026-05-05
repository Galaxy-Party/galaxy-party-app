package com.galaxy_party.backend.services;

import com.galaxy_party.backend.dto.ranked.output.RankDefinitionDto;
import com.galaxy_party.backend.dto.user.output.UserDto;
import com.galaxy_party.backend.entity.RankEntity;
import com.galaxy_party.backend.entity.UserEntity;
import com.galaxy_party.backend.repository.RankRepository;
import com.galaxy_party.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RankedService {

    private final UserRepository userRepository;
    private final RankRepository rankRepository;
    private final EloService eloService;

    public List<RankDefinitionDto> getRankDefinitions() {
        return rankRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(r -> new RankDefinitionDto(
                        r.getName(),
                        r.getIcon(),
                        r.getColor(),
                        r.getMinElo(),
                        r.getMaxElo(),
                        r.getNext()))
                .collect(Collectors.toList());
    }

    public List<UserDto> getLeaderboard() {
        return userRepository.findTop10ByOrderByEloDesc()
                .stream()
                .map(UserEntity::toUserDto)
                .collect(Collectors.toList());
    }

    public int[] updateElo(UUID winnerId, UUID loserId) {
        UserEntity winner = userRepository.findById(winnerId)
                .orElseThrow(() -> new RuntimeException("Winner not found"));
        UserEntity loser = userRepository.findById(loserId)
                .orElseThrow(() -> new RuntimeException("Loser not found"));

        int[] newElos = eloService.calculateNewElos(winner.getElo(), loser.getElo());
        winner.setElo(newElos[0]);
        loser.setElo(newElos[1]);

        userRepository.save(winner);
        userRepository.save(loser);
        return newElos;
    }
}
