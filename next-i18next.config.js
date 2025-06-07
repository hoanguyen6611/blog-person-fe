/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "vi",
    locales: ["vi", "en"],
  },
  localePath: "./public/locales", // hoặc ./src/i18n/locales nếu bạn để ở đó
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
