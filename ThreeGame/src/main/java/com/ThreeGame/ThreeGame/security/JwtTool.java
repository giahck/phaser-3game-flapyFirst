package com.ThreeGame.ThreeGame.security;

import com.ThreeGame.ThreeGame.exeptions.exeptions.UnauthorizedException;
import com.ThreeGame.ThreeGame.users.entity.Users;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTool {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.duration}")
    private long duration;

    //crea token impostando data inizio, data fine, id utente e firma del token attraverso la chiave segreta
    public String createToken(Users utente) {
        return Jwts.builder().setIssuedAt(new Date(System.currentTimeMillis())).
                expiration(new Date(System.currentTimeMillis() + duration)).
                subject(String.valueOf(utente.getId())).
                signWith(Keys.hmacShaKeyFor(secret.getBytes())).
                compact();
    }

    //effettua verifica token ricevuto. Verifica veridicita e scadenza
    public void verifyToken(String token) {
        try {
            Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret.getBytes())).
                    build().parse(token);
        } catch (Exception e) {
            throw new UnauthorizedException("Error in authorization, relogin!");
        }
    }

    public String getIdFromToken(String token){
        return Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret.getBytes())).
                build().parseSignedClaims(token).getPayload().getSubject();
    }
}
