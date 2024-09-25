package com.ThreeGame.ThreeGame.game.dto;

import lombok.Data;

import java.util.List;

@Data
public class ScoreDto {
    private long id;
    private long score;
    private int totalScore;
    private int totalGames;
    private int totalWins;
    private int totalLosses;
    private List<Long> giochiIds;
}
