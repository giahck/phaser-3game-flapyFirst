package com.trhegame.GameScore.centralizze;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {

    @Autowired
    private JwtVerificationFilter jwtVerificationFilter;

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.addFilterBefore(jwtVerificationFilter, UsernamePasswordAuthenticationFilter.class);
        http.csrf(csrf -> csrf.disable()); // Updated method to disable CSRF
    }
}