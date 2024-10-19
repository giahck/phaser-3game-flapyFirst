package com.ThreeGame.ThreeGame.security;

import com.ThreeGame.ThreeGame.users.dto.UserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.http.HttpStatus;


import java.util.HashMap;
import java.util.Map;
@Component
@RequiredArgsConstructor
public class GoogleOpaqueTokenIntrospector implements OpaqueTokenIntrospector {

    private final WebClient userInfoClient;

    @Override
    public OAuth2AuthenticatedPrincipal introspect(String token) {
       /* System.out.println("Google OAuth2");*/

        return userInfoClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/oauth2/v3/userinfo")
                        .queryParam("access_token", token)
                        .build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, response -> response.bodyToMono(String.class).flatMap(body -> {
                    //System.out.println("Client error: " + response.statusCode() + ", Response body: " + body);
                    return Mono.error(new RuntimeException("Client error: " + response.statusCode() + ", " + body));
                }))
                .onStatus(HttpStatusCode::is5xxServerError, response -> response.bodyToMono(String.class).flatMap(body -> {
                    //System.out.println("Server error: " + response.statusCode() + ", Response body: " + body);
                    return Mono.error(new RuntimeException("Server error during token introspection: " + response.statusCode() + ", " + body));
                }))
                .bodyToMono(UserInfo.class)
                .map(userInfo -> {
                    //System.out.println("Nome dell'utente: " + userInfo.name());
                    Map<String, Object> attributes = new HashMap<>();
                    attributes.put("sub", userInfo.sub());
                    attributes.put("name", userInfo.name());
                    attributes.put("email", userInfo.email());
                    attributes.put("given_name", userInfo.given_name());
                    attributes.put("family_name", userInfo.family_name());
                    return new OAuth2IntrospectionAuthenticatedPrincipal(userInfo.name(), attributes, null);
                })
                .block(); // Usa block solo se sei sicuro di essere in un contesto bloccante
    }
}
