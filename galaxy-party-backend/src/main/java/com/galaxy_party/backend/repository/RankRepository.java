package com.galaxy_party.backend.repository;

import com.galaxy_party.backend.entity.RankEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RankRepository extends JpaRepository<RankEntity, Long> {
    List<RankEntity> findAllByOrderByDisplayOrderAsc();
}
