package com.galaxy_party.backend.dto.game.output;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GameXpResultDto {
    private int winnerXp;
    private int winnerLevel;
    private boolean winnerLeveledUp;
    private int loserXp;
    private int loserLevel;
    private boolean loserLeveledUp;
}
