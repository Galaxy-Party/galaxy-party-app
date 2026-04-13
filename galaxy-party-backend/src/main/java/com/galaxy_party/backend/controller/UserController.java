package com.galaxy_party.backend.controller;


import com.galaxy_party.backend.dto.user.input.CreateUserDto;
import com.galaxy_party.backend.dto.user.input.UpdateUserDto;
import com.galaxy_party.backend.dto.user.output.UserDto;
import com.galaxy_party.backend.entity.UserEntity;
import com.galaxy_party.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;


    @GetMapping("/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable UUID id) {
        return new ResponseEntity<>(UserEntity.toUserDto(userService.findById(id)), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody CreateUserDto createUserDto) {
        return new ResponseEntity<>(UserEntity.toUserDto(userService.createUser(createUserDto)), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable UUID id, @RequestBody UpdateUserDto updateUserDto) {
        return new ResponseEntity<>(UserEntity.toUserDto(userService.updateUser(id, updateUserDto)), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        
        return ResponseEntity.noContent().build();
    }


}
