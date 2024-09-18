package com.ThreeGame.ThreeGame.soketIo;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;


@Component
public class SocketIOEventListener {
    private final ControlStanza controlStanza = new ControlStanza();
    @Setter
    private long id;

    @OnConnect
    public void onConnect(SocketIOClient client) {

        String roomName = controlStanza.assegnaStanza(client);
        if (roomName != null) {
            client.joinRoom(roomName);
            ClientInfo clientInfo = new ClientInfo();
            clientInfo.setRoomName(roomName);
            clientInfo.setId(client.getSessionId());
            clientInfo.setAttivo(false);
            clientInfo.setScore(0);
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
        controlStanza.PlayClients(client, roomName);

    }

    @OnEvent("morto")
    public synchronized void onMorto(SocketIOClient client, ClientInfo clientInfo) {
        /* stampa();*/

        clientInfo.setAttivo(true);

        controlStanza.clientInfoMap.put(client.getSessionId(), clientInfo);
        System.out.println(controlStanza.getAllClientInfoMap());

        // Send the updated client info to all clients in the room
        controlStanza.getAllClientsInRooms().entrySet().forEach(e -> {
            if (e.getValue().contains(client)) {
                List<ClientInfo> clientInfos = e.getValue().stream()
                        .map(c -> controlStanza.getClientInfo(c.getSessionId()))
                        .collect(Collectors.toList());
                e.getValue().forEach(b -> b.sendEvent("infoClient", clientInfos));
            }
        });
    }

    public void stampa() {
        System.out.println("Stanze");
        controlStanza.getAllClientsInRooms().entrySet().forEach(e -> {
            System.out.println("Room: " + e.getKey() + " has clients: ");
            e.getValue().forEach(b -> System.out.println(b.getSessionId()));
        });
        System.out.println("playClients");
        controlStanza.getAllPlayClients().entrySet().stream().forEach(e -> {
            System.out.println(e.getKey() + " " + e.getValue());
        });
        System.out.println("ClientInfo");
        System.out.println(controlStanza.getAllClientInfoMap());
        System.out.println("playCounter");
        System.out.println(controlStanza.getAllPlayCounter());
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



