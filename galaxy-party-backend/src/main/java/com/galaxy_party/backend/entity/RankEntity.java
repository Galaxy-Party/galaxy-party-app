package com.galaxy_party.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "ranks")
public class RankEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String icon;

    @Column(nullable = false)
    private String color;

    @Column(name = "min_elo", nullable = false)
    private int minElo;

    @Column(name = "max_elo")
    private Integer maxElo;

    @Column(name = "next_rank")
    private String next;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;
}
