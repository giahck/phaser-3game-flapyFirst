package com.ThreeGame.ThreeGame.users.service;

import com.ThreeGame.ThreeGame.exeptions.exeptions.ResourceNotFoundException;
import com.ThreeGame.ThreeGame.security.JwtTool;
import com.ThreeGame.ThreeGame.users.dto.LoginDto;
import com.ThreeGame.ThreeGame.users.dto.LoginRDto;
import com.ThreeGame.ThreeGame.users.dto.RegisterUserDto;
import com.ThreeGame.ThreeGame.users.dto.mapper.UserMapper;
import com.ThreeGame.ThreeGame.users.entity.Users;
import com.ThreeGame.ThreeGame.users.enums.Ruolo;
import com.ThreeGame.ThreeGame.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
//fuck it, huck e solo un pinguino
//i pinguini sono belli spesso piangono
//fanno anche la pupu?
//Ogni volta che un pinguino fa la cacca sta contribuendo
//    in maniera decisiva all'equilibrio ecologico del suo ambiente – anche se non lo sa
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTool jwtTool;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserMapper userMapper;

    public LoginRDto registerUser(RegisterUserDto registerUserDto) {
        Users user = userRepository.findByEmail(registerUserDto.getEmail())
                .map(existingUser -> {
                    if (existingUser.getPassword() == null || existingUser.getPassword().isEmpty()) {
                        existingUser.setPassword(passwordEncoder.encode(registerUserDto.getPassword()));
                    }
                    return existingUser;
                })
                .orElseGet(() -> {
                    Users newUser = userMapper.toEntity(registerUserDto);
                    newUser.setPassword(passwordEncoder.encode(registerUserDto.getPassword()));
                    newUser.setRuolo(Ruolo.USER);
                    newUser.setRememberMe(false);
                    newUser.setEnabled(false);
                    return newUser;
                });

        userRepository.save(user);
        return userMapper.toLoginRDto(user);
    }
    public LoginRDto getVerifyToken(int id, String token) {
        Users user = getUserById(id);
        LoginRDto loginRDto = userMapper.toLoginRDto(user);
        loginRDto.setJwToken(token);
        return loginRDto;
        }
    public LoginRDto login(LoginDto loginDto) {

        Optional<Users> userOptional = userRepository.findByEmail(loginDto.getEmail());

        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            if (!user.getEnabled()) {
                throw new ResourceNotFoundException("Utente non attivo, contattare l'amministratore");
            }
            if (passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
               /* if (!user.getRememberMe().equals(loginDto.getRememberMe())) {
                    user.setRememberMe(loginDto.getRememberMe());
                    userRepository.save(user);
                }*/
                LoginRDto loginRDto = userMapper.toLoginRDto(user);
                loginRDto.setJwToken(jwtTool.createToken(user));

                return loginRDto;

            } else {
                throw new ResourceNotFoundException("Errore nel login, riloggarsi");
            }
        } else {
            throw new ResourceNotFoundException("Utente con email " + loginDto.getEmail() + "non trovato ");
        }
    }
    @Transactional
    public Users getUserById(int id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Utente non trovato con id: " + id));
    }
}
