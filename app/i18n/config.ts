import path from "path";
import { UserConfig } from "next-i18next";

const i18nConfig: UserConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["vi", "en"],
  },
  localePath: path.resolve("./locales"),
  //   reloadOnPrerender: process.env.NODE_ENV === "development",
};

export default i18nConfig;
