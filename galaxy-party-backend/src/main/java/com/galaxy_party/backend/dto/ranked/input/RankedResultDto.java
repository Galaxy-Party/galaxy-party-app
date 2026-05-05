package com.galaxy_party.backend.dto.ranked.input;

import lombok.Data;

import java.util.UUID;

@Data
public class RankedResultDto {
    private UUID winnerId;
    private UUID loserId;
}
