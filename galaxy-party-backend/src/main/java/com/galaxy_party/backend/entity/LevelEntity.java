package com.galaxy_party.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "levels")
public class LevelEntity {

    @Id
    @Column(name = "level_number")
    private int levelNumber;

    @Column(name = "xp_required", nullable = false)
    private int xpRequired;

    @Column(nullable = false)
    private String title;
}
