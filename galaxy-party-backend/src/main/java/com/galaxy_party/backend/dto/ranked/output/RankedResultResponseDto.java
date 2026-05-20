package com.galaxy_party.backend.dto.ranked.output;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RankedResultResponseDto {
    private int winnerElo;
    private int loserElo;
    private int winnerXp;
    private int winnerLevel;
    private boolean winnerLeveledUp;
    private int loserXp;
    private int loserLevel;
    private boolean loserLeveledUp;
}
