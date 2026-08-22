"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { toast } from "react-toastify";

export const useRequireAuth = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn && !hasRedirected.current) {
      hasRedirected.current = true;
      toast.info("Vui lòng đăng nhập để tiếp tục.");
      router.replace(`/login?redirect_url=${encodeURIComponent(pathname)}`);
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  return { isLoaded, isSignedIn };
};
