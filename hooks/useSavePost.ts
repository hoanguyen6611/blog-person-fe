"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-toastify";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import { useRouter } from "@/i18n/navigation";

export function useSavePost() {
  const { getToken, isSignedIn } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, [getToken]);

  const { data: savedPostIds, mutate } = useSWR<string[]>(
    token ? [`${process.env.NEXT_PUBLIC_API_URL}/users/saved`, token] : null,
    ([url, token]: readonly [string, string]) =>
      fetcherWithTokenUseSWR(url, token)
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
