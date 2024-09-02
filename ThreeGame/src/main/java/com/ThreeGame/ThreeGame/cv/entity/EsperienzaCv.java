package com.ThreeGame.ThreeGame.cv.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "esperienza")
public class EsperienzaCv {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cv_id")
    @JsonIgnore
    private Cv cv;
    private String nome;
    private String luogo;
    private LocalDate dataInizio;
    private LocalDate dataFine;
    private String descrizione;
}
