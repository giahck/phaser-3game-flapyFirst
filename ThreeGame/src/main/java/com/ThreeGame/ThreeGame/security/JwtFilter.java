package com.ThreeGame.ThreeGame.security;

import com.ThreeGame.ThreeGame.exeptions.exeptions.UnauthorizedException;
import com.ThreeGame.ThreeGame.users.entity.Users;
import com.ThreeGame.ThreeGame.users.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;
@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtTool jwtTool;

    @Autowired
    private UserService usersService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Error in authorization, token missing!");
        }
        String accessToken = authHeader.substring(7);
        System.out.println(accessToken);
        jwtTool.verifyToken(accessToken);

        String id = jwtTool.getIdFromToken(accessToken);
        Optional<Users> optionalUser = Optional.ofNullable(this.usersService.getUserById(Integer.parseInt(id)));
        if(optionalUser.isPresent()){
            Users currentUser = optionalUser.get();
            Authentication authentication = new UsernamePasswordAuthenticationToken(currentUser, null, currentUser.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }else{
            throw new RuntimeException("Utente non trovato");
        }
        filterChain.doFilter(request, response);
    }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return new AntPathMatcher().match("/auth/**", request.getServletPath());
    }
}
