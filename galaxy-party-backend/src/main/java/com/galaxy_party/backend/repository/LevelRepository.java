package com.galaxy_party.backend.repository;

import com.galaxy_party.backend.entity.LevelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LevelRepository extends JpaRepository<LevelEntity, Integer> {
    List<LevelEntity> findAllByOrderByLevelNumberAsc();
}
