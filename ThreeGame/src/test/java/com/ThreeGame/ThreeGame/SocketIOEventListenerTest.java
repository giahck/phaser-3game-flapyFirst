package com.ThreeGame.ThreeGame;

import com.ThreeGame.ThreeGame.soketIo.ClientInfo;
import com.ThreeGame.ThreeGame.soketIo.ControlStanza;
import com.ThreeGame.ThreeGame.soketIo.SocketIOEventListener;
import com.corundumstudio.socketio.SocketIOClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;
/*Test della Connessione*/
public class SocketIOEventListenerTest {

    private SocketIOEventListener socketIOEventListener;
    private ControlStanza controlStanza;
    private SocketIOClient mockClient;

    @BeforeEach
    public void setUp() {
        controlStanza = mock(ControlStanza.class);
        socketIOEventListener = new SocketIOEventListener();
        // Rimuovere il controllo di accesso della proprietà e impostare il mock
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
    public void testOnConnect() {
        // Mock del comportamento di `assegnaStanza` per restituire un nome stanza
        when(controlStanza.assegnaStanza(mockClient)).thenReturn("room1");

        // Chiamata al metodo onConnect
        socketIOEventListener.onConnect(mockClient);

        // Verifica che il client sia stato aggiunto alla stanza e sia stato inviato l'evento
        verify(mockClient).joinRoom("room1");
        verify(mockClient).sendEvent(eq("infoClient"), any(ClientInfo.class));
        verify(controlStanza).addClientInfo(any(ClientInfo.class));
    }
}