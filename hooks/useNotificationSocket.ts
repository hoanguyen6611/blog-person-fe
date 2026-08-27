"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { io as clientIO } from "socket.io-client";

export function useNotificationSocket(
  onReceive: (data: any) => void
): "connected" | "disconnected" | "connecting" {
  const { getToken, isSignedIn } = useAuth();
  const socketRef = useRef<any>(null);
  const [status, setStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");

  useEffect(() => {
    if (!isSignedIn || socketRef.current?.connected) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!socketUrl) {
      console.error(
        "❌ Socket not started: NEXT_PUBLIC_SOCKET_URL is not set in this build's environment."
      );
      setStatus("disconnected");
      return;
    }

    (async () => {
      const token = await getToken();
      const socket = clientIO(socketUrl, {
        auth: { token },
        // Let the client negotiate polling -> websocket instead of forcing
        // a raw WebSocket upgrade on the first request. Forcing
        // ["websocket"] only works when every proxy/host in front of the
        // socket server passes the Upgrade handshake through cleanly; on
        // hosts where it doesn't, the connection fails silently with no
        // fallback even though the same code works fine on localhost.
        transports: ["polling", "websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setStatus("connected");
        console.log("✅ Socket connected:", socket.id);
      });

      socket.on("disconnect", (reason: any) => {
        setStatus("disconnected");
        socketRef.current = null; // reset socket ref
        console.warn("⚠️ Socket disconnected:", reason);
      });

      socket.on("connect_error", (err: any) => {
        setStatus("disconnected");
        console.error(
          `❌ Socket connection error (url: ${socketUrl}):`,
          err.message
        );
      });

      // Tránh trùng lặp
      socket.off("new-comment", onReceive);
      socket.on("new-comment", onReceive);
      socket.off("new-like", onReceive);
      socket.on("new-like", onReceive);
      socket.off("new-post", onReceive);
      socket.on("new-post", onReceive);
      socket.off("new-follow", onReceive);
      socket.on("new-follow", onReceive);
    })();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("new-comment", onReceive);
        socketRef.current.off("new-like", onReceive);
        socketRef.current.off("new-post", onReceive);
        socketRef.current.off("new-follow", onReceive);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setStatus("disconnected");
    };
  }, [isSignedIn]);

  return status;
}
