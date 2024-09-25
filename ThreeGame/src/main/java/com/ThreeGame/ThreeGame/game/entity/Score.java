package com.ThreeGame.ThreeGame.game.entity;

import com.ThreeGame.ThreeGame.users.entity.Giochi;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "score")
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private long score;
    private int totalScore;
    private int totalGames;
    private int totalWins;
    private int totalLosses;

    @OneToMany(mappedBy = "score", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Giochi> giochi;
}
