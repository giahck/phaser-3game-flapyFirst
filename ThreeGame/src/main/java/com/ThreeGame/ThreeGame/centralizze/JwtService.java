package com.ThreeGame.ThreeGame.centralizze;

import com.ThreeGame.ThreeGame.security.JwtVerifier;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.security.KeyPair;
import java.util.Date;

@Service
public class JwtService {
    @Autowired
    private KeyPair keyPair;

    public String generateToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour
                .signWith(keyPair.getPrivate(), SignatureAlgorithm.RS256)
                .compact();
    }
}