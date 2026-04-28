package com.galaxy_party.backend.controller;

import com.galaxy_party.backend.dto.friendship.input.CreateFriendshipDto;
import com.galaxy_party.backend.dto.friendship.output.FriendshipDto;
import com.galaxy_party.backend.services.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/friendships")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;

    @GetMapping
    public ResponseEntity<List<FriendshipDto>> getFriendships(@RequestParam UUID userId) {
        return ResponseEntity.ok(friendshipService.getFriendships(userId));
    }

    @PostMapping
    public ResponseEntity<FriendshipDto> createRequest(@RequestBody CreateFriendshipDto dto) {
        return new ResponseEntity<>(friendshipService.createRequest(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<FriendshipDto> accept(@PathVariable UUID id) {
        return ResponseEntity.ok(friendshipService.accept(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        friendshipService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
