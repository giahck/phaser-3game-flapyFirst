package com.trhegame.GameScore.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "score")
@Data
public class ScoreP {
    @Id
    private String id;
    private double score;
}
