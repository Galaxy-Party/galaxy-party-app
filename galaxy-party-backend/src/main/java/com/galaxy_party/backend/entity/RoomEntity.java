package com.galaxy_party.backend.entity;

import com.galaxy_party.backend.dto.room.output.RoomDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rooms")
public class RoomEntity {

    @Id
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column
    private String name;

    @OneToMany(mappedBy = "room")
    private List<UserEntity> users = new ArrayList<>();

    public static RoomDto toRoomDto(RoomEntity roomEntity) {
        return RoomDto.builder()
                .id(roomEntity.getId())
                .name(roomEntity.getName())
                .build();
    }
}
