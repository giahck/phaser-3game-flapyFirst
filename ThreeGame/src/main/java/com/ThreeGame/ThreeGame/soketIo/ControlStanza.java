package com.ThreeGame.ThreeGame.soketIo;

import com.corundumstudio.socketio.SocketIOClient;

import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class ControlStanza {
    private static final int MAX_NUMERO_persone = 3;
    private final Map<String, List<SocketIOClient>> stanze = new HashMap<>();
    public final Map<UUID, ClientInfo> clientInfoMap = new HashMap<>();
    private final Map<String, Set<UUID>> playClients = new HashMap<>();
    private final Map<String, Integer> playCounter = new HashMap<>();
    private static int contoStanza = 0;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);


    public synchronized Map<String, List<SocketIOClient>> getAllClientsInRooms() {
        return new HashMap<>(stanze);
    }

    public synchronized Map<UUID, ClientInfo> getAllClientInfoMap() {
        return new HashMap<>(clientInfoMap);
    }

    public synchronized Map<String, Set<UUID>> getAllPlayClients() {
        return new HashMap<>(playClients);
    }

    public synchronized Map<String, Integer> getAllPlayCounter() {
        return new HashMap<>(playCounter);
    }


    public synchronized String assegnaStanza(SocketIOClient client) {
        String availableRoom = null;

        for (Map.Entry<String, List<SocketIOClient>> entry : stanze.entrySet()) {
            List<SocketIOClient> clients = entry.getValue();
            if (clients.contains(client)) {
                return null;
            }
            if (clients.size() < MAX_NUMERO_persone && availableRoom == null) {
                availableRoom = entry.getKey();
            }
        }
        if (availableRoom != null) {
            stanze.get(availableRoom).add(client);
            return availableRoom;
        }

        if (stanze.isEmpty()) {
            contoStanza = 0;
        } else {
            int smallestRoomNumber = Integer.MAX_VALUE;
            for (Map.Entry<String, List<SocketIOClient>> entry : stanze.entrySet()) {
                if (entry.getValue().isEmpty()) {
                    return entry.getKey();
                }
                String roomName = entry.getKey();
                int roomNumber = Integer.parseInt(roomName.split("-")[1]);
                if (roomNumber < smallestRoomNumber) {
                    smallestRoomNumber = roomNumber;
                }
            }
            contoStanza = smallestRoomNumber + 1;
        }
        String nuovaStanzaNome = "Room-" + contoStanza++;
        List<SocketIOClient> newRoom = new ArrayList<>();
        newRoom.add(client);
        stanze.put(nuovaStanzaNome, newRoom);
        return nuovaStanzaNome;
    }

    public synchronized void removeClientFromRoom(SocketIOClient client) {
        String roomName = null;
        for (Map.Entry<String, List<SocketIOClient>> entry : stanze.entrySet()) {
            if (entry.getValue().remove(client)) {
                roomName = entry.getKey();
                if (entry.getValue().isEmpty()) {
                    stanze.remove(roomName);
                }
                break;
            }
        }
        clientInfoMap.remove(client.getSessionId());
        if (roomName != null) {
            Set<UUID> clientsWhoPlayed = playClients.get(roomName);
            if (clientsWhoPlayed != null) {
                clientsWhoPlayed.remove(client.getSessionId());
                if (clientsWhoPlayed.isEmpty()) {
                    playClients.remove(roomName);
                    playCounter.remove(roomName);
                }
            }
            infoClientUpdate(roomName);
        }
    }

    public synchronized void addClientInfo(ClientInfo clientInfo) {
        clientInfoMap.put(clientInfo.getId(), clientInfo);
    }

    public synchronized ClientInfo getClientInfo(UUID clientId) {
        return clientInfoMap.get(clientId);
    }

    public synchronized void infoClientUpdate(String roomName) {
        Map<String, List<SocketIOClient>> allClientsInRooms = getAllClientsInRooms();
        List<SocketIOClient> clientsInRoom = allClientsInRooms.get(roomName);

        if (clientsInRoom != null) {
            List<ClientInfo> clientInfos = new ArrayList<>();
            for (SocketIOClient c : clientsInRoom) {
                ClientInfo info = getClientInfo(c.getSessionId());
                if (info != null) {
                    clientInfos.add(info);
                }
            }

            ClientInfo[] clientInfoArray = clientInfos.toArray(new ClientInfo[0]);
            for (SocketIOClient c : clientsInRoom) {
                c.sendEvent("infoClient", clientInfoArray);
            }
        }
    }

    public void PlayClients(SocketIOClient client, String roomName) {
        Map<String, List<SocketIOClient>> allClientsInRooms = getAllClientsInRooms();
        if (roomName != null) {
            playClients.putIfAbsent(roomName, new HashSet<>());
            Set<UUID> clientsWhoPlayed = playClients.get(roomName);

            if (!clientsWhoPlayed.contains(client.getSessionId())) {
                clientsWhoPlayed.add(client.getSessionId());
                playCounter.put(roomName, playCounter.getOrDefault(roomName, 0) + 1);
                List<SocketIOClient> clientsInRoom = allClientsInRooms.get(roomName);
                /*System.out.println(playCounter.get(roomName));
                System.out.println(clientsInRoom.size());*/

                if (playCounter.get(roomName) == clientsInRoom.size() && clientsInRoom.size() == MAX_NUMERO_persone) {
                    AtomicInteger count = new AtomicInteger(1);

                    scheduler.scheduleAtFixedRate(() -> {
                        if (count.get() >= 0) {
                            for (SocketIOClient c : clientsInRoom) {
                                c.sendEvent("countdown", count.get());
                            }
                            count.getAndDecrement();
                        }
                    }, 0, 1, TimeUnit.SECONDS);

                } else {
                    client.sendEvent("waiting", "Aspetta altri giocatori");
                }
            }
        }
    }

}
