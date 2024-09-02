package com.ThreeGame.ThreeGame.users.dto;

import com.ThreeGame.ThreeGame.users.enums.Ruolo;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginDto {
    private String email;
    private String password;
    private Boolean rememberMe;
}
