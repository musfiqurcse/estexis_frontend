import { useEffect, useState } from "react";

const CACHE_KEY = "visitor_city";
const FALLBACK = "Dhaka";

export function useVisitorLocation() {
  const [city, setCity] = useState(() => sessionStorage.getItem(CACHE_KEY) || FALLBACK);
  const [loading, setLoading] = useState(() => !sessionStorage.getItem(CACHE_KEY));

  useEffect(() => {
    if (sessionStorage.getItem(CACHE_KEY)) return;

    let cancelled = false;
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const detected = data?.city || FALLBACK;
        sessionStorage.setItem(CACHE_KEY, detected);
        setCity(detected);
      })
      .catch(() => {
        if (!cancelled) setCity(FALLBACK);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { city, loading };
}
