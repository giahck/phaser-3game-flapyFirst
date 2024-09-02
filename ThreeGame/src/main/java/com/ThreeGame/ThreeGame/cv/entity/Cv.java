package com.ThreeGame.ThreeGame.cv.entity;

import com.ThreeGame.ThreeGame.users.entity.Users;
import lombok.Data;
import jakarta.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "cv")
public class Cv {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    /*@Version
    private Long version;*/
    private String nome;
    private String cognome;
    private String email;
    private String telefono;
    private String indirizzo;
    private String titolo;

    @OneToMany(mappedBy = "cv",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EsperienzaCv> esperienze;

    @OneToMany(mappedBy = "cv",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FormazioneCv> formazioni;
    @OneToOne
    @JoinColumn(name = "utente_id")
    private Users users;
}
