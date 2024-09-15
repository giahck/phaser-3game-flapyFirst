package com.ThreeGame.ThreeGame.soketIo;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class SocketIOEventListener {
    private final ControlStanza controlStanza = new ControlStanza();
    @OnConnect
    public void onConnect(SocketIOClient client) {
        String roomName = controlStanza.assegnaStanza(client);
        if (roomName != null) {
            client.joinRoom(roomName);
            client.sendEvent("message", "Welcome to " + roomName + "!");
        } else {
            client.sendEvent("message", "You are already in a room.");
        }
    }

    @OnDisconnect
    public void onDisconnect(SocketIOClient client) {
        controlStanza.removeClientFromRoom(client);
        System.out.println("Client disconnected: " + client.getSessionId());
    }

    @OnEvent("message")
    public void onMessage(SocketIOClient client, String data) {
        Map<String, List<SocketIOClient>> allClientsInRooms = controlStanza.getAllClientsInRooms();
        for (Map.Entry<String, List<SocketIOClient>> entry : allClientsInRooms.entrySet()) {
            String roomName = entry.getKey();
            List<SocketIOClient> clients = entry.getValue();
            System.out.println("Room: " + roomName + " has " + clients.size() + " clients.");
            for (SocketIOClient c : clients) {
                System.out.println("Client ID: " + c.getSessionId());
            }
        }
    }
}


