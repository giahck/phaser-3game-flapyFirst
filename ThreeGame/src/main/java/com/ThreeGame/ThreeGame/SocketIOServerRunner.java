/*
package com.ThreeGame.ThreeGame;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SocketIOServerRunner implements CommandLineRunner {

    private final SocketIOServer socketIOServer;

    @Autowired
    public SocketIOServerRunner(SocketIOServer socketIOServer) {
        this.socketIOServer = socketIOServer;
    }

    @Override
    public void run(String... args) throws Exception {
        socketIOServer.start();
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("Stopping Socket.IO server...");
            socketIOServer.stop();
        }));
    }
}*/
