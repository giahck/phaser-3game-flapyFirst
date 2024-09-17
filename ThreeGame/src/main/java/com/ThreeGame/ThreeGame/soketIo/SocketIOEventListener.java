package com.ThreeGame.ThreeGame.soketIo;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class SocketIOEventListener {
    private final ControlStanza controlStanza = new ControlStanza();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final Map<String, Set<UUID>> playClients = new HashMap<>();
    private final Map<String, Integer> playCounter = new HashMap<>(); // Add this line

    @OnConnect
    public void onConnect(SocketIOClient client) {
        String roomName = controlStanza.assegnaStanza(client);
        if (roomName != null) {
            client.joinRoom(roomName);
            ClientInfo clientInfo = new ClientInfo();
            clientInfo.setRoomName(roomName);
            clientInfo.setId(client.getSessionId());
            controlStanza.addClientInfo(clientInfo);
            client.sendEvent("infoClient", clientInfo);
        }
    }

    @OnDisconnect
    public void onDisconnect(SocketIOClient client) {
        controlStanza.removeClientFromRoom(client);
        System.out.println("Client disconnected: " + client.getSessionId());
    }

    /*da fare il refactor con la rimozione*/
    @OnEvent("infoClient")
    public void onMessage(SocketIOClient client, ClientInfo clientInfo) {
        String roomName = clientInfo.getRoomName();
        if (roomName != null) {
            controlStanza.addClientInfo(clientInfo);
            controlStanza.infoClientUpdate(roomName);
        }
    }
    @OnEvent("play")
    public synchronized void onPlay(SocketIOClient client, String roomName) {
        Map<String, List<SocketIOClient>> allClientsInRooms = controlStanza.getAllClientsInRooms();

        if (roomName != null) {
            playClients.putIfAbsent(roomName, new HashSet<>());
            Set<UUID> clientsWhoPlayed = playClients.get(roomName);

            if (!clientsWhoPlayed.contains(client.getSessionId())) {
                clientsWhoPlayed.add(client.getSessionId());
                playCounter.put(roomName, playCounter.getOrDefault(roomName, 0) + 1);
                List<SocketIOClient> clientsInRoom = allClientsInRooms.get(roomName);
                System.out.println(playCounter.get(roomName));
                System.out.println(clientsInRoom.size());


                if (playCounter.get(roomName) == clientsInRoom.size() && clientsInRoom.size() == 2) {
                    AtomicInteger count = new AtomicInteger(3);

                    scheduler.scheduleAtFixedRate(() -> {
                        if (count.get() >= 0) {
                            for (SocketIOClient c : clientsInRoom) {
                                c.sendEvent("countdown", count.get());
                            }
                            count.getAndDecrement();
                        }
                    }, 0, 1, TimeUnit.SECONDS);

                    scheduler.schedule(() -> startGame(roomName), 3, TimeUnit.SECONDS);
                }
            }
        }
    }

    private void startGame(String roomName) {
        System.out.println("Starting game in room: " + roomName);
        // Logica per avviare il gioco
    }


    /*   @OnEvent("infoClient")
       public void onMessage(SocketIOClient client, ClientInfo clientInfo) {
           // Get the room name of the client who sent the message
           String roomName = null;
           Map<String, List<SocketIOClient>> allClientsInRooms = controlStanza.getAllClientsInRooms();
           for (Map.Entry<String, List<SocketIOClient>> entry : allClientsInRooms.entrySet()) {
               if (entry.getValue().contains(client)) {
                   roomName = entry.getKey();
                   break;
               }
           }

           if (roomName != null) {
               // Get the list of clients in the room
               List<SocketIOClient> clientsInRoom = allClientsInRooms.get(roomName);
               // Send the message to each client in the room
               for (SocketIOClient c : clientsInRoom) {
                   c.sendEvent("infoClient", clientInfo);
               }
           }
       }*/
    /*@OnEvent("message")
    public void onMessage(SocketIOClient client, String data) {
        Map<String, List<SocketIOClient>> allClientsInRooms = controlStanza.getAllClientsInRooms();
        for (Map.Entry<String, List<SocketIOClient>> entry : allClientsInRooms.entrySet()) {
            String roomName = entry.getKey();
            List<SocketIOClient> clients = entry.getValue();
            System.out.println("Room: " + roomName + " has " + clients.size() + " clients.");
            for (SocketIOClient c : clients) {
                System.out.println("Client ID: " + c.getSessionId());
                c.sendEvent("message", data);
            }
        }
    }*/
}


