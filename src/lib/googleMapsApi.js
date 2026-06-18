let googleMapsRequest = null;

export function getGoogleMapsApiKey() {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
}

export function hasGoogleMapsApiKey() {
  return Boolean(getGoogleMapsApiKey());
}

export function loadGoogleMapsApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only be loaded in the browser."));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key is not configured."));
  }

  if (!googleMapsRequest) {
    googleMapsRequest = new Promise((resolve, reject) => {
      const existingScript = document.querySelector("script[data-google-maps-loader]");
      if (existingScript) {
        existingScript.addEventListener("load", () => {
          if (window.google?.maps) resolve(window.google);
        }, { once: true });
        existingScript.addEventListener("error", () => reject(new Error("Unable to load Google Maps.")), { once: true });
        return;
      }

      const script = document.createElement("script");
      const params = new URLSearchParams({
        key: apiKey,
        v: "weekly",
        loading: "async",
      });

      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMapsLoader = "true";
      script.addEventListener("load", () => {
        if (window.google?.maps) resolve(window.google);
      }, { once: true });
      script.addEventListener("error", () => reject(new Error("Unable to load Google Maps.")), { once: true });
      document.head.appendChild(script);
    });
  }

  return googleMapsRequest;
}
