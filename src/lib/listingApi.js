import { getDeviceType, getSessionId, normalizePublicListingPayload, toSearchParams } from "./listingUtils";

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (Array.isArray(payload.detail)) return payload.detail.join(", ");
  if (typeof payload.detail === "string") return payload.detail;

  const firstField = Object.keys(payload)[0];
  if (firstField && Array.isArray(payload[firstField])) {
    return `${firstField}: ${payload[firstField].join(", ")}`;
  }

  return fallback;
}

async function fetchJson(path) {
  const response = await fetch(`${getApiBaseUrl()}${path}`);
  const payload = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(getErrorMessage(payload, `Request failed: ${response.status}`));
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function searchListings(filters = {}) {
  const searchParams = toSearchParams(filters);
  const query = searchParams.toString();
  return fetchJson(`/api/v1/listings${query ? `?${query}` : ""}`);
}

export function getPublicListing(publicId, options = {}) {
  const searchParams = toSearchParams({
    session_id: options.session_id || getSessionId(),
    source: options.source || "direct",
    device_type: options.device_type || getDeviceType(),
  });
  const query = searchParams.toString();
  const encodedPublicId = encodeURIComponent(publicId);

  return fetchJson(`/api/v1/listings/${encodedPublicId}?${query}`)
    .catch((error) => {
      if (error.status === 404 || error.status === 405) {
        return fetchJson(`/api/v1/listing/${encodedPublicId}?${query}`);
      }
      throw error;
    })
    .then(normalizePublicListingPayload);
}

export function getSimilarListings(publicId) {
  return fetchJson(`/api/v1/listings/${encodeURIComponent(publicId)}/similar`);
}
