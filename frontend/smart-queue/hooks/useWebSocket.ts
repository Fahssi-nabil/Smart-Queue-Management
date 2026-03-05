"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

export function useWebSocket(
  onMessage: (message: WebSocketMessage) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

     // Connect to WebSocket server using SockJS and STOMP
    const socket = new SockJS("http://localhost:8084/ws");

    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,

      onConnect: () => {
        setIsConnected(true);

        client.subscribe("/topic/queue", (msg) => {
          try {
            const parsed: WebSocketMessage = JSON.parse(msg.body);
            onMessage(parsed);
          } catch (error) {
            console.error("Invalid WebSocket message", error);
          }
        });
      },

      onDisconnect: () => {
        setIsConnected(false);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, []); // IMPORTANT: keep empty

  return { isConnected };
}