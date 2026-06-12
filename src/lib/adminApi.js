const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";
const ADMIN_USER_KEY = "admin_user";

let unauthorizedHandler = null;
let refreshRequest = null;

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
}

function getUrl(path) {
  return `${getApiBaseUrl()}${path}`;
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

export function getStoredAdminSession() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const storedUser = localStorage.getItem(ADMIN_USER_KEY);
  let user = null;

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = null;
    }
  }

  return { accessToken, refreshToken, user };
}

export function storeAdminSession({ access_token, refresh_token, user }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearAdminSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new ApiError("Session expired.", 401, null);
  }

  if (!refreshRequest) {
    refreshRequest = fetch(getUrl("/api/v1/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(async (response) => {
        const payload = await parseResponse(response);
        if (!response.ok) {
          throw new ApiError(getErrorMessage(payload, "Session refresh failed."), response.status, payload);
        }

        const nextAccessToken = payload?.access_token;
        if (!nextAccessToken) {
          throw new ApiError("Session refresh response did not include an access token.", response.status, payload);
        }

        localStorage.setItem(ACCESS_TOKEN_KEY, nextAccessToken);
        if (payload.refresh_token) {
          localStorage.setItem(REFRESH_TOKEN_KEY, payload.refresh_token);
        }

        return nextAccessToken;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

export async function adminRequest(path, options = {}) {
  const { auth = true, retry = true, headers, body, ...rest } = options;
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !(body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (accessToken) requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(getUrl(path), {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined && !(body instanceof FormData) ? JSON.stringify(body) : body,
  });
  const payload = await parseResponse(response);

  if (response.status === 401 && auth && retry) {
    try {
      await refreshAccessToken();
      return adminRequest(path, { ...options, retry: false });
    } catch (error) {
      clearAdminSession();
      unauthorizedHandler?.();
      throw error;
    }
  }

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload, "Request failed."), response.status, payload);
  }

  return payload;
}

export function loginAdmin(email, password) {
  return adminRequest("/api/v1/admin/login", {
    method: "POST",
    auth: false,
    body: { email, password },
  });
}

export function logoutAdmin(refreshToken) {
  if (!refreshToken) return Promise.resolve(null);
  return adminRequest("/api/v1/auth/logout", {
    method: "POST",
    auth: false,
    body: { refresh_token: refreshToken },
  });
}

export function listPendingKyc(page = 1, size = 20) {
  return adminRequest(`/api/v1/admin/kyc/pending?page=${page}&size=${size}`);
}

export function getKycSubmission(kycId) {
  return adminRequest(`/api/v1/admin/kyc/${kycId}`);
}

export function approveKycSubmission(kycId) {
  return adminRequest(`/api/v1/admin/kyc/${kycId}/approve`, { method: "PUT" });
}

export function rejectKycSubmission(kycId, reason) {
  return adminRequest(`/api/v1/admin/kyc/${kycId}/reject`, {
    method: "PUT",
    body: { reason },
  });
}

export function listAdminUsers(page = 1, size = 20) {
  return adminRequest(`/api/v1/admin/users?page=${page}&size=${size}`);
}

export function getAdminUser(userId) {
  return adminRequest(`/api/v1/admin/users/${userId}`);
}

export function createAdminUser(email, password) {
  return adminRequest("/api/v1/admin/users/admin", {
    method: "POST",
    body: { email, password },
  });
}

export function suspendAdminUser(userId, reason) {
  return adminRequest(`/api/v1/admin/users/${userId}/suspend`, {
    method: "PUT",
    body: { reason },
  });
}

export function unsuspendAdminUser(userId) {
  return adminRequest(`/api/v1/admin/users/${userId}/unsuspend`, { method: "PUT" });
}

export function banAdminUser(userId, reason) {
  return adminRequest(`/api/v1/admin/users/${userId}/ban`, {
    method: "PUT",
    body: { reason },
  });
}

export function deleteAdminUser(userId) {
  return adminRequest(`/api/v1/admin/users/${userId}`, { method: "DELETE" });
}

export function listAdminBlogPosts() {
  return adminRequest("/api/v1/admin/blog");
}

export function getAdminBlogPost(postId) {
  return adminRequest(`/api/v1/admin/blog/${postId}`);
}

export function generateBlogPost(prompt, language = "english") {
  return adminRequest("/api/v1/admin/blog/generate", {
    method: "POST",
    body: { prompt, language },
  });
}

export function updateBlogPost(postId, data) {
  return adminRequest(`/api/v1/admin/blog/${postId}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteBlogPost(postId) {
  return adminRequest(`/api/v1/admin/blog/${postId}`, { method: "DELETE" });
}

export function publishBlogPost(postId, share_to_facebook = true) {
  return adminRequest(`/api/v1/admin/blog/${postId}/publish`, {
    method: "PATCH",
    body: { share_to_facebook },
  });
}

export function unpublishBlogPost(postId) {
  return adminRequest(`/api/v1/admin/blog/${postId}/unpublish`, { method: "PATCH" });
}

export function rejectBlogPost(postId) {
  return adminRequest(`/api/v1/admin/blog/${postId}/reject`, { method: "PATCH" });
}
