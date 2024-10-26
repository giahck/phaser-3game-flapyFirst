package com.ThreeGame.ThreeGame.cv.confiigurationApp;

import com.ThreeGame.ThreeGame.exeptions.exeptions.UnauthorizedException;
import com.ThreeGame.ThreeGame.security.GoogleOpaqueTokenIntrospector;
import com.ThreeGame.ThreeGame.security.JwtFilter;
import com.ThreeGame.ThreeGame.security.JwtTool;
import com.ThreeGame.ThreeGame.soketIo.SocketIOEventListener;
import com.ThreeGame.ThreeGame.users.entity.Users;
import com.ThreeGame.ThreeGame.users.enums.Ruolo;
import com.ThreeGame.ThreeGame.users.repository.UserRepository;
import com.corundumstudio.socketio.*;
import com.corundumstudio.socketio.listener.DataListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Component;
import com.corundumstudio.socketio.namespace.Namespace;

import java.util.Optional;

@Configuration
public class SocketIOConfig {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SocketIOEventListener socketIOEventListener;
    @Autowired
    private GoogleOpaqueTokenIntrospector googleOpaqueTokenIntrospector;
    @Autowired
    private JwtTool jwtTool;
    @Bean
    public SocketIOServer socketIOServer() {
        System.out.println("SocketIOConfig.socketIOServer");
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        SocketConfig socketConfig = new SocketConfig();
        socketConfig.setReuseAddress(true);
        config.setSocketConfig(socketConfig);
        config.setHostname("0.0.0.0");
        config.setPort(9092);

        config.setAuthorizationListener(new AuthorizationListener() {
            @Override
            public AuthorizationResult getAuthorizationResult(HandshakeData data) {
                String token = data.getSingleUrlParam("token");
                try {
                    // Attempt to validate as JWT
                    jwtTool.verifyToken(token);
                    long id = Integer.parseInt(jwtTool.getIdFromToken(token));
                    socketIOEventListener.setId(id);
                    return AuthorizationResult.SUCCESSFUL_AUTHORIZATION;
                } catch (Exception e) {
                    try {
                        // If JWT validation fails, attempt to validate as Google token
                        OAuth2AuthenticatedPrincipal principal = googleOpaqueTokenIntrospector.introspect(token);
                        String email = principal.getAttribute("email");
                        if (email == null || email.isEmpty()) {
                            throw new UnauthorizedException("Error in authorization, email is missing!");
                        }
                        Optional<Users> optionalUser = userRepository.findByEmail(email);
                        Users currentUser;

                            currentUser = optionalUser.get();

                        socketIOEventListener.setId(currentUser.getId());
                        return AuthorizationResult.SUCCESSFUL_AUTHORIZATION;
                    } catch (Exception ex) {
                        System.out.println("Errore di autorizzazione: " + ex.getMessage());
                        return AuthorizationResult.FAILED_AUTHORIZATION;
                    }
                }
            }
        });

        SocketIOServer server = new SocketIOServer(config);
	     Namespace namespace = (Namespace) server.addNamespace("/socket.io/");
        namespace.addListeners(socketIOEventListener);
        server.start();
     /*   server.addEventListener("message", String.class, new DataListener<String>() {
            @Override
            public void onData(SocketIOClient socketIOClient, String s, AckRequest ackRequest) throws Exception {
                System.out.println("Received message: " + s);
            }
        });*/

        return server;
    }
}
