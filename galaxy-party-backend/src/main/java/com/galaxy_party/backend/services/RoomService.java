package com.galaxy_party.backend.services;

import com.galaxy_party.backend.dto.room.input.CreateRoomDto;
import com.galaxy_party.backend.entity.RoomEntity;
import com.galaxy_party.backend.entity.UserEntity;
import com.galaxy_party.backend.repository.RoomRepository;
import com.galaxy_party.backend.repository.UserRepository;
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
    private final UserRepository userRepository;

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

        RoomEntity room = roomRepository.findById(id)
                .orElseThrow();

        for (UserEntity user : room.getUsers()) {
            user.setRoom(null);
        }


        roomRepository.deleteById(id);
    }



    public Boolean joinRoom(UUID roomId, UUID userId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RoomEntity room = this.findById(roomId);

        List<UserEntity> users = room.getUsers();

        if (users == null){
            room.setUsers(List.of(userEntity));
        } else {
            if (users.contains(userEntity)){
                return false;
            }

            users.add(userEntity);

            room.setUsers(users);
        }

        userEntity.setRoom(room);

        userRepository.save(userEntity);
        roomRepository.save(room);

        return true;
    }
}
