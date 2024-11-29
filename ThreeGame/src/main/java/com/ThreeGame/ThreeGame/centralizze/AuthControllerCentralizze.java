package com.ThreeGame.ThreeGame.centralizze;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.KeyPair;
import java.util.Base64;

@RestController
@RequestMapping("/api/auth")
public class AuthControllerCentralizze {

    @Autowired
    private KeyPair keyPair;

    @GetMapping("/public-key")
    public String getPublicKey() {
        return Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
    }
}
