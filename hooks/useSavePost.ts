"use client";

import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-toastify";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { useRouter } from "@/i18n/navigation";

export function useSavePost() {
  const { getToken, isSignedIn } = useAuth();
  const router = useRouter();

  // Fetch a fresh token inside the SWR fetcher (not cached in state) — a
  // Clerk JWT expires in ~60s, so a token grabbed once on mount and reused
  // for later revalidations (refocus, reconnect) would send a stale token
  // and get a silent 401 from the backend.
  const { data: savedPostIds, mutate } = useSWR<string[]>(
    isSignedIn ? ["users-saved"] : null,
    async () => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/users/saved`,
        token!
      );
    }
  );

  const isSaved = (postId: string) =>
    !!savedPostIds?.some((id) => id === postId);

  const toggleSaved = async (postId: string) => {
    if (!isSignedIn) {
      router.push("/login");
      return;
    }
    const authToken = await getToken();
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/save`,
      { postId },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    if (res.status === 200) {
      await mutate();
      toast.success(res.data || "Saved successfully");
    }
  };

  return { savedPostIds: savedPostIds ?? [], isSaved, toggleSaved };
}
