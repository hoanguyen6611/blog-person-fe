import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

if (
  typeof globalThis !== "undefined" &&
  "localStorage" in globalThis &&
  typeof localStorage.getItem !== "function"
) {
  const _store = new Map<string, string>();
  const _ls: Storage = {
    get length() {
      return _store.size;
    },
    clear: () => _store.clear(),
    getItem: (key: string) => _store.get(key) ?? null,
    key: (index: number) => [..._store.keys()][index] ?? null,
    removeItem: (key: string) => {
      _store.delete(key);
    },
    setItem: (key: string, value: string) => {
      _store.set(key, value);
    },
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: _ls,
    configurable: true,
    writable: true,
  });
}

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["drive.google.com"],
  },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
