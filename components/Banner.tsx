"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";

const Banner = () => {
  const t = useTranslations("Banner");
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex-1 space-y-6">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-snug">
          {t("title")}
        </h1>
        <p className="text-lg text-gray-600 mt-4">{t("description")}</p>
        <Link href="/write">
          <button className="mt-6 px-6 py-3 bg-blue-800 text-white font-medium rounded-full hover:bg-blue-700 transition-all">
            {t("startWriting")}
          </button>
        </Link>
      </div>

      <Link href="/write" className="relative hidden md:block">
        <svg
          viewBox="0 0 200 200"
          width="200"
          height="200"
          className="animate-spin-slow text-blue-800 tracking-widest"
        >
          <path
            id="circlePath"
            fill="none"
            d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
          />
          <text>
            <textPath href="#circlePath" startOffset="0%">
              Write your story.{" "}
            </textPath>
            <textPath href="#circlePath" startOffset="50%">
              Share your idea.{" "}
            </textPath>
          </text>
        </svg>
        <button className="absolute inset-0 m-auto w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="40"
            height="40"
            stroke="white"
            strokeWidth="2"
            fill="none"
          >
            <line x1="6" y1="18" x2="18" y2="6" />
            <polyline points="9 6 18 6 18 15" />
          </svg>
        </button>
      </Link>
    </div>
  );
};

export default Banner;
