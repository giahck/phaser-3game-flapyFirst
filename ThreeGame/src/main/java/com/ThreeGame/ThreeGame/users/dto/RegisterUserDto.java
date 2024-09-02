package com.ThreeGame.ThreeGame.users.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class RegisterUserDto {
    private String cognome;
    private String nome;
    @Email(message = "Invalid email format")
    private String email;
    private Boolean enabled;
    private String password;
}
