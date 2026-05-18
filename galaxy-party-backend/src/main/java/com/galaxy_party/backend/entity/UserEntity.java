package com.galaxy_party.backend.entity;

import com.galaxy_party.backend.dto.user.output.UserDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @Column(updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "email_verified_at")
    private Instant emailVerifiedAt;

    @Column
    private String imageName;

    @Column(nullable = false)
    @Builder.Default
    private int elo = 0;

    @Column(nullable = false)
    @Builder.Default
    private int wins = 0;

    @Column(name = "games_played", nullable = false)
    @Builder.Default
    private int gamesPlayed = 0;

    @Column(nullable = false)
    @Builder.Default
    private int xp = 0;

    @Column(nullable = false)
    @Builder.Default
    private int level = 1;

    @Column(name = "equipped_title")
    private String equippedTitle;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = true)
    private RoomEntity room;

    public static UserDto toUserDto(UserEntity userEntity) {
        return UserDto.builder()
                .id(userEntity.getId())
                .username(userEntity.getUsername())
                .imageName(userEntity.getImageName())
                .elo(userEntity.getElo())
                .wins(userEntity.getWins())
                .gamesPlayed(userEntity.getGamesPlayed())
                .xp(userEntity.getXp())
                .level(userEntity.getLevel())
                .equippedTitle(userEntity.getEquippedTitle())
                .build();
    }
}
