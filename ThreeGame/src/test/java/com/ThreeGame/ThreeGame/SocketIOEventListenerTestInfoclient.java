package com.ThreeGame.ThreeGame;

import com.ThreeGame.ThreeGame.soketIo.ClientInfo;
import com.ThreeGame.ThreeGame.soketIo.ControlStanza;
import com.ThreeGame.ThreeGame.soketIo.SocketIOEventListener;
import com.corundumstudio.socketio.SocketIOClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class SocketIOEventListenerTestInfoclient {
    private SocketIOEventListener socketIOEventListener;
    private ControlStanza controlStanza;
    private SocketIOClient mockClient;

    @BeforeEach
    public void setUp() {
        controlStanza = mock(ControlStanza.class);
        socketIOEventListener = new SocketIOEventListener();
        try {
            var field = SocketIOEventListener.class.getDeclaredField("controlStanza");
            field.setAccessible(true);
            field.set(socketIOEventListener, controlStanza);
        } catch (Exception e) {
            e.printStackTrace();
        }
        mockClient = mock(SocketIOClient.class);
    }

    @Test
    public void testOnMessage() {
        ClientInfo clientInfo = new ClientInfo();
        clientInfo.setRoomName("room1");

        // Chiamata al metodo onMessage
        socketIOEventListener.onMessage(mockClient, clientInfo);

        // Verifica che le informazioni del client siano state aggiunte e aggiornate
        verify(controlStanza).addClientInfo(clientInfo);
        verify(controlStanza).infoClientUpdate("room1");
    }
}
