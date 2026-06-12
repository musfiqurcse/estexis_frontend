function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
}

async function fetchJson(path) {
  const response = await fetch(`${getApiBaseUrl()}${path}`);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return response.json();
}

export function listBlogPosts() {
  return fetchJson("/api/v1/blog");
}

export function getBlogPost(slug) {
  return fetchJson(`/api/v1/blog/${encodeURIComponent(slug)}`);
}
