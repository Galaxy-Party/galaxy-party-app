package com.galaxy_party.backend.dto.level.output;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LevelDto {
    private int levelNumber;
    private int xpRequired;
    private String title;
}
