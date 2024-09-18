package com.ThreeGame.ThreeGame.cv.confiigurationApp;

import com.ThreeGame.ThreeGame.security.JwtFilter;
import com.ThreeGame.ThreeGame.security.JwtTool;
import com.ThreeGame.ThreeGame.soketIo.SocketIOEventListener;
import com.corundumstudio.socketio.*;
import com.corundumstudio.socketio.listener.DataListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
public class SocketIOConfig {
    @Autowired
    private SocketIOEventListener socketIOEventListener;
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
                    jwtTool.verifyToken(token);
                    long id = Integer.parseInt(jwtTool.getIdFromToken(token));

                    socketIOEventListener.setId(id);
                    return AuthorizationResult.SUCCESSFUL_AUTHORIZATION;
                } catch (Exception e) {
                    System.out.println("Errore di autorizzazione: " + e.getMessage());
                    return AuthorizationResult.FAILED_AUTHORIZATION;
                }
            }
        });

        SocketIOServer server = new SocketIOServer(config);
        server.addListeners(socketIOEventListener);
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
