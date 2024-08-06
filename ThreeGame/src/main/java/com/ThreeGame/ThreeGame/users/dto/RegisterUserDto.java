package com.ThreeGame.ThreeGame.users.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class RegisterUserDto {
    private String cognome;
    private String nome;
    private String email;
    private Boolean enabled=false;
    private String password;
}
