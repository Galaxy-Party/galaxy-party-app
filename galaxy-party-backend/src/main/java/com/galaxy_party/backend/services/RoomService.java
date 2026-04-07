package com.galaxy_party.backend.services;

import com.galaxy_party.backend.dto.room.input.CreateRoomDto;
import com.galaxy_party.backend.entity.RoomEntity;
import com.galaxy_party.backend.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<RoomEntity> findAll() {
        return roomRepository.findAll();
    }

    public RoomEntity findById(final UUID id) {
        return roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public RoomEntity createRoom(CreateRoomDto createRoomDto) {
        return roomRepository.save(CreateRoomDto.toRoomEntity(createRoomDto));
    }

    public void deleteRoom(UUID id) {
        roomRepository.deleteById(id);
    }


}
