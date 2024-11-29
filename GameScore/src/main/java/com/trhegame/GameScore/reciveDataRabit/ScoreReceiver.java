package com.trhegame.GameScore.reciveDataRabit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trhegame.GameScore.entity.ScoreP;
import com.trhegame.GameScore.repository.ScoreRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static org.apache.tomcat.util.http.parser.HttpParser.isNumeric;

@Service
public class ScoreReceiver {
    @Autowired
    private ScoreRepository scoreRepository;

    @RabbitListener(queues = "scoreQueue")
    public String receiveMessage(String message) {
        ObjectMapper objectMapper = new ObjectMapper();

        try {

            // Prova a processare il messaggio come JSON
            try {
                ScoreP score = objectMapper.readValue(message, ScoreP.class);
                 scoreRepository.save(score);
                System.out.println("Received JSON data: " + score);
                return null;
            } catch (Exception ignored) {}

            // Altrimenti, processa come Integer e restituisci la risposta
            return processIntegerMessage(message, objectMapper);

        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
            throw new RuntimeException("Error processing message", e);
        }
    }

    private String processIntegerMessage(String message, ObjectMapper objectMapper) {
        try {
            int id = Integer.parseInt(message);
            System.out.println("Processing as integer ID: " + id);

            // Recupera il dato dal repository
            ScoreP score = scoreRepository.findById(message).orElse(null);

            // Serializza in JSON
            String scoreJson = objectMapper.writeValueAsString(score);
            System.out.println("Converted to JSON: " + scoreJson);
            return scoreJson;
        } catch (Exception e) {
            System.err.println("Error processing integer message: " + e.getMessage());
            throw new RuntimeException("Error processing integer message", e);
        }
    }

}
