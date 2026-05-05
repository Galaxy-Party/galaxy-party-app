package com.galaxy_party.backend.dto.ranked.output;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RankedResultResponseDto {
    private int winnerElo;
    private int loserElo;
}
