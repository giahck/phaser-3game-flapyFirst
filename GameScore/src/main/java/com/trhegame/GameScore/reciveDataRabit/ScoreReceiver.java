package com.trhegame.GameScore.reciveDataRabit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trhegame.GameScore.entity.ScoreP;
import com.trhegame.GameScore.repository.ScoreRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ScoreReceiver {
    @Autowired
    private ScoreRepository scoreRepository;
    @RabbitListener(queues = "scoreQueue")
    public void receiveMessage(String message) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // Deserializza il messaggio JSON in un oggetto
            // Deserializza il messaggio JSON in un oggetto Score
            ScoreP score = objectMapper.readValue(message, ScoreP.class);

            // Salva il punteggio nel database MongoDB
            scoreRepository.save(score);
            // Gestisci i dati ricevuti
            System.out.println("Received data: " + score);
        } catch (Exception e) {
            // Gestisci l'eccezione se la deserializzazione fallisce
            System.err.println("Error deserializing message: " + e.getMessage());
        }
    }
}
