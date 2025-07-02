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

    (async () => {
      const token = await getToken();
      const socket = clientIO(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        auth: { token },
        transports: ["websocket"],
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
        console.error("❌ Socket connection error:", err.message);
      });

      // Tránh trùng lặp
      socket.off("new-comment", onReceive);
      socket.on("new-comment", onReceive);
    })();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("new-comment", onReceive);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setStatus("disconnected");
    };
  }, [isSignedIn]);

  return status;
}
