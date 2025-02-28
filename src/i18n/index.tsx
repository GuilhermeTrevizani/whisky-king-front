import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import translationPortugueBrazilian from "./ptbr.json";

const resources = {
  ptbr: {
    translation: translationPortugueBrazilian,
  },
}

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: "ptbr",
  });

export default i18next;