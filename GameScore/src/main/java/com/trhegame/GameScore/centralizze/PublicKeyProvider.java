package com.trhegame.GameScore.centralizze;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Service
public class PublicKeyProvider {
    private PublicKey publicKey;
    @PostConstruct
    public void fetchPublicKey() throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://192.168.1.19:8080/api/auth/public-key";
        System.out.println("Fetching public key from: " + url); // Aggiungi questa linea per il log
        String publicKeyString = restTemplate.getForObject(url, String.class);

        byte[] keyBytes = Base64.getDecoder().decode(publicKeyString);
        this.publicKey = KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(keyBytes));
    }

    public PublicKey getPublicKey() {
        return publicKey;
    }

}
