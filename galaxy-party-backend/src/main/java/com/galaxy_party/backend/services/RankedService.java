package com.galaxy_party.backend.services;

import com.galaxy_party.backend.dto.ranked.output.RankDefinitionDto;
import com.galaxy_party.backend.dto.ranked.output.RankedResultResponseDto;
import com.galaxy_party.backend.dto.user.output.UserDto;
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
    private final LevelService levelService;

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

    public RankedResultResponseDto updateElo(UUID winnerId, UUID loserId) {
        UserEntity winner = userRepository.findById(winnerId)
                .orElseThrow(() -> new RuntimeException("Winner not found"));
        UserEntity loser = userRepository.findById(loserId)
                .orElseThrow(() -> new RuntimeException("Loser not found"));

        int[] newElos = eloService.calculateNewElos(winner.getElo(), loser.getElo());

        int winnerOldLevel = winner.getLevel();
        int winnerNewXp = winner.getXp() + 30;
        int winnerNewLevel = levelService.computeLevel(winnerNewXp);
        winner.setElo(newElos[0]);
        winner.setWins(winner.getWins() + 1);
        winner.setGamesPlayed(winner.getGamesPlayed() + 1);
        winner.setXp(winnerNewXp);
        winner.setLevel(winnerNewLevel);

        int loserOldLevel = loser.getLevel();
        int loserNewXp = loser.getXp() + 10;
        int loserNewLevel = levelService.computeLevel(loserNewXp);
        loser.setElo(newElos[1]);
        loser.setGamesPlayed(loser.getGamesPlayed() + 1);
        loser.setXp(loserNewXp);
        loser.setLevel(loserNewLevel);

        userRepository.save(winner);
        userRepository.save(loser);

        return new RankedResultResponseDto(
                newElos[0], newElos[1],
                winnerNewXp, winnerNewLevel, winnerNewLevel > winnerOldLevel,
                loserNewXp, loserNewLevel, loserNewLevel > loserOldLevel
        );
    }
}
