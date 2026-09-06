"use client";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export type PushStatus =
  | "unsupported"
  | "default"
  | "denied"
  | "subscribed";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<PushStatus>("default");
  const [loading, setLoading] = useState(false);

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const supported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    !!publicKey;

  useEffect(() => {
    if (!supported) {
      if (typeof window !== "undefined" && !publicKey) {
        // The toggle silently disappears (returns null) whenever this key
        // is missing — easy to mistake for "the feature is broken" instead
        // of "not configured in this build's env".
        console.warn(
          "⚠️ Push notifications hidden: NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set in this build's environment."
        );
      }
      setStatus("unsupported");
      return;
    }
    (async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        setStatus("subscribed");
      } else {
        setStatus(Notification.permission === "denied" ? "denied" : "default");
      }
    })();
  }, [supported]);

  const subscribe = useCallback(async () => {
    if (!supported || !publicKey) return false;
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return false;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const token = await getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/push-subscribe`,
        sub.toJSON(),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("subscribed");
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, [supported, publicKey, getToken]);

  const unsubscribe = useCallback(async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        const token = await getToken();
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/notifications/push-unsubscribe`,
            { endpoint: sub.endpoint },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .catch(() => null);
        await sub.unsubscribe();
      }
      setStatus("default");
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  return { status, loading, supported, subscribe, unsubscribe };
}
