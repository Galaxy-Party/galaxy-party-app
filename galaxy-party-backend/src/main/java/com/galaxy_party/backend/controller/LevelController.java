package com.galaxy_party.backend.controller;

import com.galaxy_party.backend.dto.game.output.GameXpResultDto;
import com.galaxy_party.backend.dto.level.output.LevelDto;
import com.galaxy_party.backend.services.LevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/levels")
@RequiredArgsConstructor
public class LevelController {

    private final LevelService levelService;

    @GetMapping("/definitions")
    public ResponseEntity<List<LevelDto>> getLevelDefinitions() {
        return ResponseEntity.ok(levelService.getLevelDefinitions());
    }

    @PostMapping("/game-result")
    public ResponseEntity<GameXpResultDto> submitGameResult(@RequestBody Map<String, String> body) {
        UUID winnerId = UUID.fromString(body.get("winnerId"));
        UUID loserId = UUID.fromString(body.get("loserId"));
        return ResponseEntity.ok(levelService.grantGameXp(winnerId, loserId));
    }
}
