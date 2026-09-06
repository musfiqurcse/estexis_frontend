const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

let accessToken = null;
let refreshRequest = null;
let unauthorizedHandler = null;

export class InvestorApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "InvestorApiError";
    this.status = status;
    this.payload = payload;
  }
}

function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
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

function errorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (Array.isArray(payload.detail)) return payload.detail.join(", ");
  if (typeof payload.detail === "string") return payload.detail;
  const field = Object.keys(payload)[0];
  if (field && Array.isArray(payload[field])) return `${field}: ${payload[field].join(", ")}`;
  return fallback;
}

function acceptSession(payload) {
  accessToken = payload?.access_token || null;
  return payload;
}

export function setInvestorUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export function clearInvestorAccessToken() {
  accessToken = null;
}

export async function refreshInvestorSession() {
  if (!refreshRequest) {
    refreshRequest = fetch(apiUrl("/api/v1/auth/browser/refresh"), {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        const payload = await parseResponse(response);
        if (!response.ok) {
          throw new InvestorApiError(
            errorMessage(payload, "Session refresh failed."),
            response.status,
            payload,
          );
        }
        return acceptSession(payload);
      })
      .finally(() => {
        refreshRequest = null;
      });
  }
  return refreshRequest;
}

async function request(path, options = {}) {
  const { auth = false, retry = true, body, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);
  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (auth && accessToken) requestHeaders.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(apiUrl(path), {
    ...rest,
    credentials: "include",
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await parseResponse(response);

  if (response.status === 401 && auth && retry) {
    try {
      await refreshInvestorSession();
      return request(path, { ...options, retry: false });
    } catch (error) {
      clearInvestorAccessToken();
      unauthorizedHandler?.();
      throw error;
    }
  }
  if (!response.ok) {
    throw new InvestorApiError(
      errorMessage(payload, `Request failed: ${response.status}`),
      response.status,
      payload,
    );
  }
  return payload;
}

export async function loginInvestor(email, password) {
  const payload = await request("/api/v1/auth/browser/login", {
    method: "POST",
    body: { email, password },
  });
  return acceptSession(payload);
}

export async function logoutInvestor() {
  try {
    await request("/api/v1/auth/browser/logout", { method: "POST" });
  } finally {
    clearInvestorAccessToken();
  }
}

export function previewScenario(payload) {
  return request("/api/v1/investment-scenarios/preview", { method: "POST", body: payload });
}

export function listInvestmentPresets(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, value);
  });
  const query = params.toString();
  return request(`/api/v1/investment-scenarios/presets${query ? `?${query}` : ""}`);
}

export function saveScenario(payload) {
  return request("/api/v1/investment-scenarios", { method: "POST", auth: true, body: payload });
}

export function listSavedScenarios(page = 1, size = 50) {
  return request(`/api/v1/investment-scenarios?page=${page}&size=${size}`, { auth: true });
}

export function getSavedScenario(publicId, version) {
  const query = version ? `?version=${encodeURIComponent(version)}` : "";
  return request(`/api/v1/investment-scenarios/${encodeURIComponent(publicId)}${query}`, {
    auth: true,
  });
}

export function createScenarioVersion(publicId, payload) {
  return request(`/api/v1/investment-scenarios/${encodeURIComponent(publicId)}/versions`, {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export function compareSavedScenarios(scenarios) {
  return request("/api/v1/investment-scenarios/compare", {
    method: "POST",
    auth: true,
    body: { scenarios },
  });
}

export function shareSavedScenario(publicId, expiresInDays = 30) {
  return request(`/api/v1/investment-scenarios/${encodeURIComponent(publicId)}/share`, {
    method: "POST",
    auth: true,
    body: { expires_in_days: expiresInDays },
  });
}

export function getSharedScenario(token) {
  return request(`/api/v1/investment-scenarios/shared/${encodeURIComponent(token)}`);
}

export function deleteScenario(publicId) {
  return request(`/api/v1/investment-scenarios/${encodeURIComponent(publicId)}`, {
    method: "DELETE",
    auth: true,
  });
}
