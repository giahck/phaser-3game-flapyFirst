package com.trhegame.GameScore.repository;

import com.trhegame.GameScore.entity.ScoreP;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ScoreRepository extends MongoRepository<ScoreP, String> {

}