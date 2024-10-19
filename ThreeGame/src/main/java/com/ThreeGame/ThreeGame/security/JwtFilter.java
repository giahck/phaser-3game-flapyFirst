package com.ThreeGame.ThreeGame.security;

import com.ThreeGame.ThreeGame.exeptions.exeptions.UnauthorizedException;
import com.ThreeGame.ThreeGame.users.entity.Users;
import com.ThreeGame.ThreeGame.users.enums.Ruolo;
import com.ThreeGame.ThreeGame.users.repository.UserRepository;
import com.ThreeGame.ThreeGame.users.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Currency;
import java.util.Optional;
@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtTool jwtTool;
    @Lazy
    @Autowired
    private UserService usersService;
    @Autowired
    private GoogleOpaqueTokenIntrospector googleOpaqueTokenIntrospector;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
	   /*  System.out.println("Request Method: " + request.getMethod());
        System.out.println("Request URI: " + request.getRequestURI());*/
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Error in authorization, token missing!");
        }

        String accessToken = authHeader.substring(7);
        try {
            // Tenta di validare come JWT del tuo server
            jwtTool.verifyToken(accessToken);
            String id = jwtTool.getIdFromToken(accessToken);

            Optional<Users> optionalUser = Optional.ofNullable(this.usersService.getUserById(Integer.parseInt(id)));
            if (optionalUser.isPresent()) {
                Users currentUser = optionalUser.get();
                Authentication authentication = new UsernamePasswordAuthenticationToken(currentUser, accessToken, currentUser.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
             //   System.out.println("JWT");

            } else {
                throw new RuntimeException("Utente non trovato");
            }
        } catch (Exception e) {
            // Se la validazione JWT fallisce, tentiamo di validare il token Google
            try {
              /*  System.out.println("Google OAuth222");*/
                OAuth2AuthenticatedPrincipal principal = googleOpaqueTokenIntrospector.introspect(accessToken);
               /* System.out.println("Access Token (Google): " + accessToken);*/

                // Cerca l'utente nel database usando l'email
                String email = principal.getAttribute("email");
                String firstName = principal.getAttribute("given_name");
                String family_name = principal.getAttribute("family_name");
                String sub = principal.getAttribute("sub");
                String given_name =  principal.getAttribute("given_name");
//                System.out.println("Email: " + email);
//                System.out.println("Nome: " + firstName);
//                System.out.println("given_name"+ given_name);
//                System.out.println("family_name"+ family_name);
//                System.out.println("sub: " + sub);
//                System.out.println("verified_email: " + principal.getAttribute("email_verified"));

                if (email == null || email.isEmpty()) {
                    throw new UnauthorizedException("Error in authorization, email is missing!");
                }
                Optional<Users> optionalUser = userRepository.findByEmail(email);
                Users currentUser;

                if (optionalUser.isPresent()) {
                    currentUser = optionalUser.get();
                } else {
                    // Se l'utente non esiste, puoi crearlo qui
                    currentUser = new Users();
                    currentUser.setEmail(email);
                    currentUser.setEnabled(true);
                    currentUser.setRuolo(Ruolo.valueOf("USER"));
                    currentUser.setNome(given_name);
                    currentUser.setCognome(family_name);
                    currentUser.setRememberMe(true);
                    userRepository.save(currentUser);
                }

                Authentication authentication = new UsernamePasswordAuthenticationToken(currentUser, accessToken, currentUser.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
              //  System.out.println("Google OAuth2");
            } catch (Exception ex) {
                throw new UnauthorizedException("Error in authorization, token invalid! " + ex.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String[] excludedPaths = {"/api/auth/**"};
        AntPathMatcher pathMatcher = new AntPathMatcher();

        for (String path : excludedPaths) {
            if (pathMatcher.match(path, request.getServletPath())) {
                return true;
            }
        }
        return false;
    }

}
