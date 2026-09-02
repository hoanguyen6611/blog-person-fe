"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { io as clientIO, Socket } from "socket.io-client";
import { toast } from "react-toastify";

type SocketStatus = "connected" | "disconnected" | "connecting";
type Listener = (data: any) => void;

// The bell is mounted twice at once (desktop + mobile variants both live in
// the DOM, toggled by CSS only). Without a module-level singleton, each
// mounted instance opened its own socket connection, so every server event
// fired the "new-X" listener — and its toast — once per instance.
let sharedSocket: Socket | null = null;
let sharedUserId: string | null = null;
let refCount = 0;
const listeners = new Set<Listener>();
const statusListeners = new Set<(status: SocketStatus) => void>();
const EVENTS = ["new-comment", "new-like", "new-post", "new-follow"];

const broadcastStatus = (status: SocketStatus) => {
  statusListeners.forEach((fn) => fn(status));
};

const ensureSocket = (token: string) => {
  if (sharedSocket) return sharedSocket;

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (!socketUrl) {
    console.error(
      "❌ Socket not started: NEXT_PUBLIC_SOCKET_URL is not set in this build's environment."
    );
    return null;
  }

  const socket = clientIO(socketUrl, {
    auth: { token },
    // Let the client negotiate polling -> websocket instead of forcing a raw
    // WebSocket upgrade on the first request — see git history for why.
    transports: ["polling", "websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });
  sharedSocket = socket;

  socket.on("connect", () => {
    broadcastStatus("connected");
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason: any) => {
    broadcastStatus("disconnected");
    console.warn("⚠️ Socket disconnected:", reason);
  });

  socket.on("connect_error", (err: any) => {
    broadcastStatus("disconnected");
    console.error(`❌ Socket connection error (url: ${socketUrl}):`, err.message);
  });

  EVENTS.forEach((event) => {
    socket.on(event, (data: any) => {
      // Shown once per event here, centrally — not from each subscriber's
      // onReceive — since the bell mounts twice (desktop + mobile) and both
      // subscribe to the same shared socket.
      if (data?.message) toast.success(data.message);
      listeners.forEach((fn) => fn(data));
    });
  });

  return socket;
};

const teardownSocket = () => {
  if (sharedSocket) {
    sharedSocket.removeAllListeners();
    sharedSocket.disconnect();
    sharedSocket = null;
    sharedUserId = null;
  }
};

export function useNotificationSocket(
  onReceive: (data: any) => void
): SocketStatus {
  const { getToken, isSignedIn, userId } = useAuth();
  const [status, setStatus] = useState<SocketStatus>("connecting");

  useEffect(() => {
    if (!isSignedIn || !userId) {
      return;
    }

    // A different account signed in under an existing shared socket —
    // tear it down so the next connection authenticates as the new user.
    if (sharedSocket && sharedUserId !== userId) {
      teardownSocket();
      refCount = 0;
    }

    refCount += 1;
    let cancelled = false;

    (async () => {
      const token = await getToken();
      if (cancelled || !token) return;
      sharedUserId = userId;
      ensureSocket(token);
    })();

    const statusListener = (s: SocketStatus) => setStatus(s);
    statusListeners.add(statusListener);
    listeners.add(onReceive);

    return () => {
      cancelled = true;
      listeners.delete(onReceive);
      statusListeners.delete(statusListener);
      refCount -= 1;
      if (refCount <= 0) {
        teardownSocket();
      }
    };
  }, [isSignedIn, userId, getToken]);

  return status;
}
