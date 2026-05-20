package com.galaxy_party.backend.repository;

import com.galaxy_party.backend.entity.FriendshipEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FriendshipRepository extends JpaRepository<FriendshipEntity, UUID> {

    @Query("SELECT f FROM FriendshipEntity f WHERE f.requester.id = :userId OR f.addressee.id = :userId")
    List<FriendshipEntity> findAllByUserId(@Param("userId") UUID userId);

    Optional<FriendshipEntity> findByRequesterIdAndAddresseeId(UUID requesterId, UUID addresseeId);

    @Query("SELECT f FROM FriendshipEntity f WHERE (f.requester.id = :a AND f.addressee.id = :b) OR (f.requester.id = :b AND f.addressee.id = :a)")
    Optional<FriendshipEntity> findBetween(@Param("a") UUID a, @Param("b") UUID b);
}
