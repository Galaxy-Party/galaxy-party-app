package com.galaxy_party.backend.dto.ranked.output;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RankDefinitionDto {
    private String name;
    private String icon;
    private String color;
    private int minElo;
    private Integer maxElo;
    private String next;
}
