package com.trhegame.GameScore.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

@Document(collection = "score")
@Data
public class ScoreP implements Serializable {
    @Id
    private String id;
    private float score;
}
