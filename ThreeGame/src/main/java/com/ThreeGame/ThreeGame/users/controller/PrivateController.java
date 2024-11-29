package com.ThreeGame.ThreeGame.users.controller;

import com.ThreeGame.ThreeGame.users.dto.LoginRDto;
import com.ThreeGame.ThreeGame.users.dto.MessageDto;
import com.ThreeGame.ThreeGame.users.entity.Users;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PrivateController {

    @GetMapping("api/messages")
    public ResponseEntity<LoginRDto> getUserProfile(@AuthenticationPrincipal Users currentUser, Authentication authentication) {
        // Controlla se l'utente è autenticato
       /* System.out.println("Access token: "+currentUser);*/
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // Estrai il token di accesso dall'oggetto Authentication
        String accessToken = (String) authentication.getCredentials();

        // Crea il DTO di risposta utilizzando i dettagli dell'utente autenticato
        LoginRDto loginRDto = new LoginRDto(
                currentUser.getId(),
                currentUser.getCognome(),
                currentUser.getNome(),
                currentUser.getEmail(),
                currentUser.isEnabled(),
                currentUser.getRememberMe(),
                accessToken, // Passa il token di accesso
                currentUser.getRuolo()
        );

        return ResponseEntity.ok(loginRDto);
    }
}