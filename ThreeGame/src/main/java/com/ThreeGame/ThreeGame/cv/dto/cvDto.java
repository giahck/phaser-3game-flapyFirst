package com.ThreeGame.ThreeGame.cv.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data


public class cvDto {
    private long id;
    private String nome;
    private String cognome;
    private String email;
    private String telefono;
    private String indirizzo;
    private String titolo;

    private List<Esperienza> esperienze;
    private List<Formazione> formazioni;

    @Data
    public static class Esperienza {
        private String nome;
        private String luogo;
        private LocalDate dataInizio;
        private LocalDate dataFine;
        private String descrizione;
    }

    @Data
    public static class Formazione {
        private String nome;
        private String luogo;
        private LocalDate dataInizio;
        private LocalDate dataFine;
        private String descrizione;
    }
}
