package com.ThreeGame.ThreeGame.users.controller;

import com.ThreeGame.ThreeGame.exeptions.exeptions.BadRequestException;
import com.ThreeGame.ThreeGame.exeptions.exeptions.UnauthorizedException;
import com.ThreeGame.ThreeGame.security.GoogleOpaqueTokenIntrospector;
import com.ThreeGame.ThreeGame.security.JwtTool;
import com.ThreeGame.ThreeGame.users.dto.LoginDto;
import com.ThreeGame.ThreeGame.users.dto.LoginRDto;
import com.ThreeGame.ThreeGame.users.dto.RegisterUserDto;
import com.ThreeGame.ThreeGame.users.dto.mapper.UserMapper;
import com.ThreeGame.ThreeGame.users.entity.Users;
import com.ThreeGame.ThreeGame.users.enums.Ruolo;
import com.ThreeGame.ThreeGame.users.repository.UserRepository;
import com.ThreeGame.ThreeGame.users.service.UserService;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    private JwtTool jwtTool;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GoogleOpaqueTokenIntrospector googleOpaqueTokenIntrospector;
    @Autowired
    private UserMapper userMapper;
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

            // Attempt to validate as JWT
            jwtTool.verifyToken(token);
            String id = jwtTool.getIdFromToken(token);
            LoginRDto loginRDto = userService.getVerifyToken(Integer.parseInt(id), token);
            return ResponseEntity.ok(loginRDto);
        } catch (Exception e) {
            // If JWT validation fails, attempt to validate as Google token
            try {
                /*System.out.println("Principal: ");*/
                OAuth2AuthenticatedPrincipal principal =  googleOpaqueTokenIntrospector.introspect(token);
                String email = principal.getAttribute("email");
                if (email == null || email.isEmpty()) {
                    throw new UnauthorizedException("Error in authorization, email is missing!");
                }
                /*System.out.println("Access Token (Google): " + token);*/
                Optional<Users> optionalUser = userRepository.findByEmail(email);
                Users currentUser;
                if (optionalUser.isPresent()) {
                    currentUser = optionalUser.get();
                } else {
                    // If user does not exist, create a new one
                    currentUser = new Users();
                    currentUser.setEmail(email);
                    currentUser.setEnabled(true);
                    currentUser.setRuolo(Ruolo.USER);
                    currentUser.setNome(principal.getAttribute("given_name"));
                    currentUser.setCognome(principal.getAttribute("family_name"));
                    userRepository.save(currentUser);
                }
                LoginRDto loginRDto = userMapper.toLoginRDto(currentUser);
                loginRDto.setJwToken(token);
                return ResponseEntity.ok(loginRDto);
            } catch (Exception ex) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token non valido: " + ex.getMessage());
            }
        } /*catch (Exception e) {
            // Handle other errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore durante la validazione: " + e.getMessage());
        }*/
    }
}
