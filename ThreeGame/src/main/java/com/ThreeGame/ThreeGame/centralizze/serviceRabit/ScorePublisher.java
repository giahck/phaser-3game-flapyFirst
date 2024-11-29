package com.ThreeGame.ThreeGame.centralizze.serviceRabit;

import com.ThreeGame.ThreeGame.centralizze.restScore.dto.ScoreDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ScorePublisher {
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public ScorePublisher(RabbitTemplate rabbitTemplate, ObjectMapper objectMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendData(Object data) {
        try {
            // Serializza l'oggetto in una stringa JSON
            String jsonData = objectMapper.writeValueAsString(data);

            // Invia i dati tramite RabbitMQ
            rabbitTemplate.convertAndSend("scoreExchange", "score.update", jsonData);

        } catch (JsonProcessingException e) {
            // Gestisci l'eccezione se la serializzazione fallisce
            System.err.println("Error serializing data: " + e.getMessage());
            // Puoi anche rilanciare un'eccezione personalizzata, se necessario
            throw new RuntimeException("Error serializing and sending score data", e);
        } catch (Exception e) {
            // Gestisci altre eccezioni, se necessario
            System.err.println("Error sending message to RabbitMQ: " + e.getMessage());
            throw new RuntimeException("Error sending data to RabbitMQ", e);
        }
    }
}
