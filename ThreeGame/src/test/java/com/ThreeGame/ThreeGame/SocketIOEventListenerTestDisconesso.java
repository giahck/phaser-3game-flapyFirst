package com.ThreeGame.ThreeGame;

import com.ThreeGame.ThreeGame.soketIo.ControlStanza;
import com.ThreeGame.ThreeGame.soketIo.SocketIOEventListener;
import com.corundumstudio.socketio.SocketIOClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
/*Test della Disconessione*/
public class SocketIOEventListenerTestDisconesso {
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
    public void testOnDisconnect() {
        // Chiamata al metodo onDisconnect
        socketIOEventListener.onDisconnect(mockClient);

        // Verifica che il client sia stato rimosso dalla stanza
        verify(controlStanza).removeClientFromRoom(mockClient);
    }
}
