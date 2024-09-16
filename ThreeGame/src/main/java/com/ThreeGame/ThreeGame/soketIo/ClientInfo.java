package com.ThreeGame.ThreeGame.soketIo;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class ClientInfo {
    private UUID id;
    private String name;
    private String roomName;
}
