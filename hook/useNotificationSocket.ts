"use client";
import { io as clientIO } from "socket.io-client";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

let socket: any;

export function useNotificationSocket(onReceive: (data: any) => void) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    (async () => {
      const token = await getToken();
      // console.log(token);

      socket = clientIO(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        auth: { token },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected", socket.data);
      });

      socket.on("new-comment", onReceive);
    })();

    return () => {
      socket?.disconnect();
    };
  }, [isSignedIn]);
}
