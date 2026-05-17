import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ar } from "./ar";
import { bn } from "./bn";
import { de } from "./de";
import { en } from "./en";

const dictionaries = { en, bn, ar, de };
const labels = { en: "English", bn: "বাংলা", ar: "العربية", de: "Deutsch" };
const currencyLabels = { EUR: "EUR", BDT: "BDT" };
const currencySymbols = { EUR: "€", BDT: "৳" };
const supportedCurrencies = new Set(["EUR", "BDT"]);
const rtlLanguages = new Set(["ar"]);
const localeMap = { en: "en-US", bn: "bn-BD", ar: "ar-SA", de: "de-DE" };
const currencyCookieName = "estexis_currency";
const bdtRateCookieName = "estexis_bdt_rate";
const bdtRateDateCookieName = "estexis_bdt_rate_date";
const bdtRateFetchedAtCookieName = "estexis_bdt_rate_fetched_at";
const rateCacheDurationMs = 24 * 60 * 60 * 1000;
const I18nContext = createContext(null);
let bdtRateRequest = null;

function getPathValue(source, path) {
  return path.split(".").reduce((value, part) => value?.[part], source);
}

function getCookie(name) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.split("; ").find((item) => item.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : "";
}

function setCookie(name, value) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
}

function getInitialCurrency() {
  const cookieCurrency = getCookie(currencyCookieName);
  return supportedCurrencies.has(cookieCurrency) ? cookieCurrency : "EUR";
}

function getInitialBdtRate() {
  const rate = Number(getCookie(bdtRateCookieName));
  return Number.isFinite(rate) && rate > 0 ? rate : null;
}

function hasFreshBdtRate() {
  const rate = Number(getCookie(bdtRateCookieName));
  const fetchedAt = Number(getCookie(bdtRateFetchedAtCookieName));

  return Number.isFinite(rate) && rate > 0 && Number.isFinite(fetchedAt) && Date.now() - fetchedAt < rateCacheDurationMs;
}

function fetchBdtRate() {
  if (!bdtRateRequest) {
    bdtRateRequest = fetch("https://api.frankfurter.dev/v2/rates?quotes=BDT")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load BDT exchange rate");
        return response.json();
      })
      .then((data) => {
        const bdtRate = Array.isArray(data) ? data.find((item) => item?.base === "EUR" && item?.quote === "BDT") : null;
        const nextRate = Number(bdtRate?.rate);

        if (!Number.isFinite(nextRate) || nextRate <= 0) {
          throw new Error("Invalid BDT exchange rate");
        }

        setCookie(bdtRateCookieName, String(nextRate));
        setCookie(bdtRateDateCookieName, bdtRate?.date || "");
        setCookie(bdtRateFetchedAtCookieName, String(Date.now()));

        return nextRate;
      })
      .finally(() => {
        bdtRateRequest = null;
      });
  }

  return bdtRateRequest;
}

function formatWithSymbol(locale, amount, currency) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  });

  return formatter
    .formatToParts(amount)
    .map((part) => (part.type === "currency" ? currencySymbols[currency] : part.value))
    .join("");
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");
  const [currency, setCurrencyState] = useState(getInitialCurrency);
  const [bdtRate, setBdtRate] = useState(getInitialBdtRate);
  const safeLanguage = dictionaries[language] ? language : "en";
  const safeCurrency = supportedCurrencies.has(currency) ? currency : "EUR";
  const direction = rtlLanguages.has(safeLanguage) ? "rtl" : "ltr";

  useEffect(() => {
    localStorage.setItem("language", safeLanguage);
    document.documentElement.lang = safeLanguage;
    document.documentElement.dir = direction;
  }, [safeLanguage, direction]);

  useEffect(() => {
    setCookie(currencyCookieName, safeCurrency);
  }, [safeCurrency]);

  useEffect(() => {
    if (safeCurrency !== "BDT") return;
    if (bdtRate && hasFreshBdtRate()) return;

    let cancelled = false;
    fetchBdtRate()
      .then((nextRate) => {
        if (!cancelled) setBdtRate(nextRate);
      })
      .catch(() => {
        // Keep the latest cached rate when the live rate is temporarily unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [safeCurrency, bdtRate]);

  const value = useMemo(() => {
    const locale = localeMap[safeLanguage];
    const displayCurrency = safeCurrency === "BDT" && bdtRate ? "BDT" : "EUR";
    const convertCurrencyValue = (amount) => (displayCurrency === "BDT" ? amount * bdtRate : amount);

    return {
      language: safeLanguage,
      currency: safeCurrency,
      currencyLabels,
      currencySymbols,
      direction,
      labels,
      setLanguage,
      setCurrency: (nextCurrency) => {
        setCurrencyState(supportedCurrencies.has(nextCurrency) ? nextCurrency : "EUR");
      },
      t: (key) => getPathValue(dictionaries[safeLanguage], key) || getPathValue(en, key) || key,
      convertCurrencyValue,
      formatCurrency: (amount) => formatWithSymbol(locale, convertCurrencyValue(amount), displayCurrency),
      formatDate: (date) => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(date)),
      formatNumber: (value) => new Intl.NumberFormat(locale).format(value),
    };
  }, [safeLanguage, safeCurrency, direction, bdtRate]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within I18nProvider");
  }
  return context;
}
