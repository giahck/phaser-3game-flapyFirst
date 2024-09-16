package com.ThreeGame.ThreeGame.soketIo;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
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
            ClientInfo clientInfo = new ClientInfo();
            clientInfo.setRoomName(roomName);
            clientInfo.setId(client.getSessionId());
            controlStanza.addClientInfo(clientInfo);
            client.sendEvent( "infoClient", clientInfo);
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
            // modifico il client col nome
            controlStanza.addClientInfo(clientInfo);

            // lista dei client nella stanza
            Map<String, List<SocketIOClient>> allClientsInRooms = controlStanza.getAllClientsInRooms();
            List<SocketIOClient> clientsInRoom = allClientsInRooms.get(roomName);

            if (clientsInRoom != null) {
                // Raccogliere le informazioni di tutti i client nella stanza
                List<ClientInfo> clientInfos = new ArrayList<>();
                for (SocketIOClient c : clientsInRoom) {
                    ClientInfo info = controlStanza.getClientInfo(c.getSessionId());
                    if (info != null) {
                        clientInfos.add(info);
                    }
                }

                // Invia l'array di ClientInfo a tutti i client nella stanza
                ClientInfo[] clientInfoArray = clientInfos.toArray(new ClientInfo[0]);
                System.out.println(Arrays.toString(clientInfoArray));
                for (SocketIOClient c : clientsInRoom) {
                    c.sendEvent("infoClient", clientInfoArray);
                }
            }
        }
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


