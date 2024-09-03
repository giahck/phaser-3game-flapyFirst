package com.ThreeGame.ThreeGame.users.controller;

import com.ThreeGame.ThreeGame.exeptions.exeptions.BadRequestException;
import com.ThreeGame.ThreeGame.security.JwtTool;
import com.ThreeGame.ThreeGame.users.dto.LoginDto;
import com.ThreeGame.ThreeGame.users.dto.LoginRDto;
import com.ThreeGame.ThreeGame.users.dto.RegisterUserDto;
import com.ThreeGame.ThreeGame.users.service.UserService;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private JwtTool jwtTool;
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public LoginRDto register(@RequestBody @Validated RegisterUserDto registerUserDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        return userService.registerUser(registerUserDto);
    }

    @PostMapping("/login")
    public LoginRDto login(@RequestBody @Validated LoginDto loginDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        return userService.login(loginDto);
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            token = token.replace("Bearer ", "");

            jwtTool.verifyToken(token);
            String id = jwtTool.getIdFromToken(token);
            LoginRDto loginRDto = userService.getVerifyToken(Integer.parseInt(id), token);
            return ResponseEntity.ok(loginRDto);
        } catch (JwtException e) {
            // Specifico per errori JWT
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token non valido: " + e.getMessage());
        } catch (Exception e) {
            // Gestisce altri errori
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante la validazione: " + e.getMessage());
        }
    }
}
