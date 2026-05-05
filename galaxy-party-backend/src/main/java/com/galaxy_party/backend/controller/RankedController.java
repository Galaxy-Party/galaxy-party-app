package com.galaxy_party.backend.controller;

import com.galaxy_party.backend.dto.ranked.input.RankedResultDto;
import com.galaxy_party.backend.dto.ranked.output.RankDefinitionDto;
import com.galaxy_party.backend.dto.ranked.output.RankedResultResponseDto;
import com.galaxy_party.backend.dto.user.output.UserDto;
import com.galaxy_party.backend.services.RankedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ranked")
@RequiredArgsConstructor
public class RankedController {

    private final RankedService rankedService;

    @GetMapping("/definitions")
    public ResponseEntity<List<RankDefinitionDto>> getRankDefinitions() {
        return ResponseEntity.ok(rankedService.getRankDefinitions());
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserDto>> getLeaderboard() {
        return ResponseEntity.ok(rankedService.getLeaderboard());
    }

    @PostMapping("/result")
    public ResponseEntity<RankedResultResponseDto> submitResult(@RequestBody RankedResultDto dto) {
        int[] newElos = rankedService.updateElo(dto.getWinnerId(), dto.getLoserId());
        return ResponseEntity.ok(new RankedResultResponseDto(newElos[0], newElos[1]));
    }
}
