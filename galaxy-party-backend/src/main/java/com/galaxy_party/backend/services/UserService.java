package com.galaxy_party.backend.services;

import com.galaxy_party.backend.dto.user.input.CreateUserDto;
import com.galaxy_party.backend.dto.user.input.UpdateUserDto;
import com.galaxy_party.backend.entity.UserEntity;
import com.galaxy_party.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserEntity createUser(CreateUserDto createUserDto) {
        return userRepository.save(CreateUserDto.toUserEntity(createUserDto));
    }

    public UserEntity updateUser(UUID userid, UpdateUserDto updateUserDto) {
        UserEntity userEntity = this.findById(userid);

        if (updateUserDto.getUsername() != null) {
            userEntity.setUsername(updateUserDto.getUsername());
        }
        if (updateUserDto.getImageName() != null) {
            userEntity.setImageName(updateUserDto.getImageName());
        }
        if (updateUserDto.getEquippedTitle() != null) {
            userEntity.setEquippedTitle(updateUserDto.getEquippedTitle());
        }

        return userRepository.save(userEntity);
    }

    public void deleteUser(UUID userid) {
        userRepository.deleteById(userid);
    }

    public UserEntity findById(UUID userid) {
        return userRepository.findById(userid).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
