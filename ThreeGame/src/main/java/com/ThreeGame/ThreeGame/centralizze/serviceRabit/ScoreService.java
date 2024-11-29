package com.ThreeGame.ThreeGame.centralizze.serviceRabit;

import com.ThreeGame.ThreeGame.centralizze.restScore.dto.ScoreDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ScoreService {
    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Autowired
    private ObjectMapper objectMapper;
    public ScoreDto getScoreResponse(String requestData) {
        try {
          //  System.out.println("Received JSON data: " + requestData);
            String scoreDto= (String) rabbitTemplate.convertSendAndReceive("scoreExchange", "score.update", requestData);
        //    System.out.println("Received response: " + scoreDto);
            return objectMapper.readValue(scoreDto, ScoreDto.class);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching response: " + e.getMessage(), e);
        }
    }
}
