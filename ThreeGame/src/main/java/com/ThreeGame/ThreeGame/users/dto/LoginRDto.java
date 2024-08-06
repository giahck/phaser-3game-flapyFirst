package com.ThreeGame.ThreeGame.users.dto;

import com.ThreeGame.ThreeGame.users.enums.Ruolo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRDto {
    private int id;
    private String cognome;
    private String nome;
    private String email;
    private Boolean enabled;
    private Boolean rememberMe;
    private String accessToken;

    @Enumerated(EnumType.STRING)
    private Ruolo ruolo;

}
