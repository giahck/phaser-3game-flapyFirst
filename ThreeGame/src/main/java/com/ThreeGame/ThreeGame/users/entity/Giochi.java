package com.ThreeGame.ThreeGame.users.entity;

import com.ThreeGame.ThreeGame.game.entity.Score;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "giochi")
public class Giochi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String nomeGioco;
    private int scoreGioco;
    private int nPartite;

    @ManyToOne
    @JoinColumn(name = "score_id")
    private Score score;

    @ManyToMany(mappedBy = "giochi")
    private List<Users> users;
}
