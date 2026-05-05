package com.galaxy_party.backend.repository;

import com.galaxy_party.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmailOrUsername(String email, String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    List<UserEntity> findTop10ByOrderByEloDesc();
}