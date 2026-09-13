"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

// Same follow/unfollow action used by the profile page's Follow button
// (PATCH /users/follow toggles based on current state server-side) — this
// hook just makes that reusable for callers that don't already have their
// own handleFollow, like the Following list's per-row unfollow button.
export function useFollowToggle() {
  const { getToken } = useAuth();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const toggleFollow = async (userId: string) => {
    setTogglingId(userId);
    try {
      const token = await getToken();
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/follow`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return true;
    } catch {
      return false;
    } finally {
      setTogglingId(null);
    }
  };

  return { toggleFollow, togglingId };
}
