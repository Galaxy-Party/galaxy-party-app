package com.galaxy_party.backend.controller;

import com.galaxy_party.backend.dto.room.input.CreateRoomDto;
import com.galaxy_party.backend.dto.room.output.RoomDto;
import com.galaxy_party.backend.entity.RoomEntity;
import com.galaxy_party.backend.services.RoomService;
import lombok.RequiredArgsConstructor;
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
    public List<RoomDto> findAll() {
        return roomService.findAll().stream().map(RoomEntity::toRoomDto).toList();
    }

    @GetMapping("/{id}")
    public RoomDto findById(@PathVariable UUID id) {
        return RoomEntity.toRoomDto(roomService.findById(id));
    }


    @PostMapping
    public RoomDto createRoom(@RequestBody CreateRoomDto createRoomDto) {
        return RoomEntity.toRoomDto(roomService.createRoom(createRoomDto));
    }

    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable UUID id) {
        roomService.deleteRoom(id);
    }
}
