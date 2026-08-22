"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const Banner = () => {
  const t = useTranslations("Banner");
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="flex-1 space-y-5 max-w-xl">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent-ink">
          Tech News
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-ink leading-tight tracking-tight text-balance">
          {t("title")}
        </h1>
        <p className="text-lg text-muted mt-4">{t("description")}</p>
        <Link href="/write">
          <button
            className="mt-6 px-6 py-3 bg-accent text-white font-semibold rounded-full hover:opacity-90 transition-all"
            data-testid="banner-start-writing-button"
          >
            {t("startWriting")}
          </button>
        </Link>
      </div>

      <Link href="" className="relative hidden md:block shrink-0">
        <svg
          viewBox="0 0 200 200"
          width="160"
          height="160"
          className="text-lg tracking-widest animate-spin animateButton text-muted"
        >
          <path
            id="circlePath"
            fill="none"
            d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
          />
          <text fill="currentColor">
            <textPath href="#circlePath" startOffset="0%">
              Write your story .{" "}
            </textPath>
            <textPath href="#circlePath" startOffset="50%">
              Share your idea .{" "}
            </textPath>
          </text>
        </svg>
        <button className="absolute top-0 left-0 right-0 bottom-0 m-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="none"
            stroke="white"
            strokeWidth="2"
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
