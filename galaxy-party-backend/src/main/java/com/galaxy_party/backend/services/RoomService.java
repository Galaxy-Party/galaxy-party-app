package com.galaxy_party.backend.services;

import com.galaxy_party.backend.dto.room.input.CreateRoomDto;
import com.galaxy_party.backend.dto.room.input.UpdateRoomDto;
import com.galaxy_party.backend.dto.room.output.RoomDto;
import com.galaxy_party.backend.entity.RoomEntity;
import com.galaxy_party.backend.entity.UserEntity;
import com.galaxy_party.backend.repository.RoomRepository;
import com.galaxy_party.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<RoomEntity> findAll() {
        return roomRepository.findAll();
    }

    public RoomEntity findById(final UUID id) {
        return roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public RoomEntity createRoom(CreateRoomDto createRoomDto) {
        RoomEntity room = CreateRoomDto.toRoomEntity(createRoomDto);
        if (room.getPassword() != null && !room.getPassword().isEmpty()) {
            room.setPassword(passwordEncoder.encode(room.getPassword()));
        }
        return roomRepository.save(room);
    }

    public void deleteRoom(UUID id) {

        RoomEntity room = roomRepository.findById(id)
                .orElseThrow();

        for (UserEntity user : room.getUsers()) {
            user.setRoom(null);
        }

        roomRepository.deleteById(id);
    }

    public void deleteAllRooms() {
        List<RoomEntity> rooms = roomRepository.findAll();
        for (RoomEntity room : rooms) {
            for (UserEntity user : room.getUsers()) {
                user.setRoom(null);
            }
        }
        roomRepository.deleteAll();
    }



    public RoomDto leaveRoom(UUID roomId, UUID userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        RoomEntity room = findById(roomId);

        room.getUsers().remove(user);
        user.setRoom(null);
        userRepository.save(user);

        if (room.getUsers().isEmpty()) {
            roomRepository.delete(room);
            return null;
        }

        if (room.getOwnerId().equals(userId)) {
            room.setOwnerId(room.getUsers().get(0).getId());
        }

        roomRepository.save(room);
        return RoomEntity.toRoomDto(room);
    }

    public RoomDto updateRoom(UUID roomId, UpdateRoomDto dto) {
        RoomEntity room = findById(roomId);
        if (dto.getTimer() != null) {
            room.setTimer(dto.getTimer());
        }
        if (dto.getPassword() != null) {
            room.setPassword(dto.getPassword().isEmpty() ? null : passwordEncoder.encode(dto.getPassword()));
        }
        roomRepository.save(room);
        return RoomEntity.toRoomDto(room);
    }

    public Boolean joinRoom(UUID roomId, UUID userId, String password) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RoomEntity room = this.findById(roomId);

        String roomPassword = room.getPassword();
        if (roomPassword != null && !roomPassword.isEmpty()) {
            if (password == null || !passwordEncoder.matches(password, roomPassword)) {
                throw new RuntimeException("Invalid password");
            }
        }

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
