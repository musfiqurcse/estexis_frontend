import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ar } from "./ar";
import { bn } from "./bn";
import { de } from "./de";
import { en } from "./en";

const dictionaries = { en, bn, ar, de };
const labels = { en: "English", bn: "বাংলা", ar: "العربية", de: "Deutsch" };
const rtlLanguages = new Set(["ar"]);
const localeMap = { en: "en-US", bn: "bn-BD", ar: "ar-SA", de: "de-DE" };
const I18nContext = createContext(null);

function getPathValue(source, path) {
  return path.split(".").reduce((value, part) => value?.[part], source);
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");
  const safeLanguage = dictionaries[language] ? language : "en";
  const direction = rtlLanguages.has(safeLanguage) ? "rtl" : "ltr";

  useEffect(() => {
    localStorage.setItem("language", safeLanguage);
    document.documentElement.lang = safeLanguage;
    document.documentElement.dir = direction;
  }, [safeLanguage, direction]);

  const value = useMemo(() => {
    const locale = localeMap[safeLanguage];
    return {
      language: safeLanguage,
      direction,
      labels,
      setLanguage,
      t: (key) => getPathValue(dictionaries[safeLanguage], key) || getPathValue(en, key) || key,
      formatCurrency: (amount) =>
        new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount),
      formatDate: (date) => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(date)),
      formatNumber: (value) => new Intl.NumberFormat(locale).format(value),
    };
  }, [safeLanguage, direction]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within I18nProvider");
  }
  return context;
}
