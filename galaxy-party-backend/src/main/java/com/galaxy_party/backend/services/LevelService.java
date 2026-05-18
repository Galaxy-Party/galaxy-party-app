package com.galaxy_party.backend.services;

import com.galaxy_party.backend.dto.game.output.GameXpResultDto;
import com.galaxy_party.backend.dto.level.output.LevelDto;
import com.galaxy_party.backend.entity.LevelEntity;
import com.galaxy_party.backend.entity.UserEntity;
import com.galaxy_party.backend.repository.LevelRepository;
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
public class LevelService {

    private final LevelRepository levelRepository;
    private final UserRepository userRepository;
    private List<LevelEntity> cachedLevels;

    private List<LevelEntity> getCachedLevels() {
        if (cachedLevels == null) {
            cachedLevels = levelRepository.findAllByOrderByLevelNumberAsc();
        }
        return cachedLevels;
    }

    public int computeLevel(int xp) {
        int level = 1;
        for (LevelEntity l : getCachedLevels()) {
            if (xp >= l.getXpRequired()) {
                level = l.getLevelNumber();
            }
        }
        return level;
    }

    public List<LevelDto> getLevelDefinitions() {
        return getCachedLevels().stream()
                .map(l -> new LevelDto(l.getLevelNumber(), l.getXpRequired(), l.getTitle()))
                .collect(Collectors.toList());
    }

    public GameXpResultDto grantGameXp(UUID winnerId, UUID loserId) {
        UserEntity winner = userRepository.findById(winnerId)
                .orElseThrow(() -> new RuntimeException("Winner not found"));
        UserEntity loser = userRepository.findById(loserId)
                .orElseThrow(() -> new RuntimeException("Loser not found"));

        int winnerOldLevel = winner.getLevel();
        int winnerNewXp = winner.getXp() + 30;
        int winnerNewLevel = computeLevel(winnerNewXp);
        winner.setWins(winner.getWins() + 1);
        winner.setGamesPlayed(winner.getGamesPlayed() + 1);
        winner.setXp(winnerNewXp);
        winner.setLevel(winnerNewLevel);

        int loserOldLevel = loser.getLevel();
        int loserNewXp = loser.getXp() + 10;
        int loserNewLevel = computeLevel(loserNewXp);
        loser.setGamesPlayed(loser.getGamesPlayed() + 1);
        loser.setXp(loserNewXp);
        loser.setLevel(loserNewLevel);

        userRepository.save(winner);
        userRepository.save(loser);

        return new GameXpResultDto(
                winnerNewXp, winnerNewLevel, winnerNewLevel > winnerOldLevel,
                loserNewXp, loserNewLevel, loserNewLevel > loserOldLevel
        );
    }
}
