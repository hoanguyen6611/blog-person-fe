"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-4">
      <Link href={`/en${pathname.replace(/^\/(en|vi)/, "")}`}>🇺🇸 English</Link>
      <Link href={`/vi${pathname.replace(/^\/(en|vi)/, "")}`}>
        🇻🇳 Tiếng Việt
      </Link>
    </div>
  );
}
