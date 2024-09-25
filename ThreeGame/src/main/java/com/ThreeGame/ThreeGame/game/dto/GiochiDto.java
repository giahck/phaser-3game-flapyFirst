package com.ThreeGame.ThreeGame.game.dto;

import lombok.Data;

import java.util.List;

@Data
public class GiochiDto {
    private long id;
    private String nomeGioco;
    private int scoreGioco;
    private int nPartite;
    private long scoreId; // Reference to Score entity
    private List<Long> userIds;
}
