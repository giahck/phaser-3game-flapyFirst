package com.ThreeGame.ThreeGame.soketIo;

import com.corundumstudio.socketio.SocketIOClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ControlStanza {
    private static final int MAX_NUMERO_persone = 2;
    private final Map<String, List<SocketIOClient>>  stanze=new HashMap<>();
    private  int contoStanza=0;

    public synchronized String assegnaStanza(SocketIOClient client) {
        String availableRoom = null;

        for (Map.Entry<String, List<SocketIOClient>> entry : stanze.entrySet()) {
            List<SocketIOClient> clients = entry.getValue();


            if (clients.contains(client)) {
                System.out.println("Client already in room: " + entry.getKey());
                return null;
            }


            if (clients.size() < MAX_NUMERO_persone && availableRoom == null) {
                availableRoom = entry.getKey();
            }
        }


        if (availableRoom != null) {
            System.out.println("Client connected: " + client.getSessionId());
            stanze.get(availableRoom).add(client);
            return availableRoom;
        }


        String nuovaStanzaNome = "Room-" + contoStanza++;
        List<SocketIOClient> newRoom = new ArrayList<>();
        newRoom.add(client);
        stanze.put(nuovaStanzaNome, newRoom);
        return nuovaStanzaNome;
    }
    public synchronized void removeClientFromRoom(SocketIOClient client) {
        for (Map.Entry<String, List<SocketIOClient>> entry : stanze.entrySet()) {
            if (entry.getValue().remove(client)) {
                if (entry.getValue().isEmpty()) {
                    stanze.remove(entry.getKey());
                }
                break;
            }
        }
    }
    public synchronized Map<String, List<SocketIOClient>> getAllClientsInRooms() {
        return new HashMap<>(stanze);
    }

}
