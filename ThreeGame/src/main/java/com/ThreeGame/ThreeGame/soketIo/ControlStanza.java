package com.ThreeGame.ThreeGame.soketIo;

import com.corundumstudio.socketio.SocketIOClient;

import java.util.*;

public class ControlStanza {
    private static final int MAX_NUMERO_persone = 3;
    private final Map<String, List<SocketIOClient>> stanze = new HashMap<>();
    private final Map<UUID, ClientInfo> clientInfoMap = new HashMap<>();
    private static int contoStanza = 0;

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
            infoClientUpdate(roomName);
        }
    }

    public synchronized Map<String, List<SocketIOClient>> getAllClientsInRooms() {
        return new HashMap<>(stanze);
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

}
