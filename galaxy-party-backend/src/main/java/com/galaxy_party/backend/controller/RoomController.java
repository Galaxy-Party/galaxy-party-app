package com.galaxy_party.backend.controller;

import com.galaxy_party.backend.dto.room.input.CreateRoomDto;
import com.galaxy_party.backend.dto.room.input.JoinRoomDto;
import com.galaxy_party.backend.dto.room.input.LeaveRoomDto;
import com.galaxy_party.backend.dto.room.output.RoomDto;
import com.galaxy_party.backend.entity.RoomEntity;
import com.galaxy_party.backend.services.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<RoomDto>> findAll() {
        return new ResponseEntity<>(roomService.findAll().stream().map(RoomEntity::toRoomDto).toList(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDto> findById(@PathVariable UUID id) {
        return new ResponseEntity<>(RoomEntity.toRoomDto(roomService.findById(id)), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<RoomDto> createRoom(@RequestBody CreateRoomDto createRoomDto) {
        return new ResponseEntity<>(RoomEntity.toRoomDto(roomService.createRoom(createRoomDto)), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable UUID id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/join/{id}")
    public ResponseEntity<Boolean> joinRoom(@PathVariable UUID id, @RequestBody JoinRoomDto joinRoomDto) {
        return new ResponseEntity<>(roomService.joinRoom(id, joinRoomDto.getUserId(), joinRoomDto.getPassword()), HttpStatus.OK);
    }

    @PostMapping("/leave/{id}")
    public ResponseEntity<RoomDto> leaveRoom(@PathVariable UUID id, @RequestBody LeaveRoomDto leaveRoomDto) {
        RoomDto result = roomService.leaveRoom(id, leaveRoomDto.getUserId());
        if (result == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(result);
    }
    
}
