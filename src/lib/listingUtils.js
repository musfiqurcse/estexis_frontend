export const listingPurposeOptions = [
  { value: "", label: "Any purpose" },
  { value: "sale", label: "Sale" },
  { value: "rental", label: "Rental" },
];

export const propertyCategoryOptions = [
  { value: "", label: "Any category" },
  { value: "private", label: "Private" },
  { value: "commercial", label: "Commercial" },
];

export const assetTypeOptions = [
  { value: "", label: "Any type" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "land", label: "Land" },
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop" },
  { value: "warehouse", label: "Warehouse" },
  { value: "building", label: "Building" },
  { value: "room", label: "Room" },
  { value: "studio", label: "Studio" },
  { value: "other", label: "Other" },
];

export const fullViewPolicyOptions = [
  { value: "public", label: "Public" },
  { value: "verified_only", label: "Verified only" },
  { value: "verified_premium_only", label: "Verified premium only" },
];

export const propertyConditionOptions = [
  { value: "", label: "Any condition" },
  { value: "new", label: "New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "needs_renovation", label: "Needs renovation" },
];

export const furnishedStatusOptions = [
  { value: "", label: "Any furnishing" },
  { value: "furnished", label: "Furnished" },
  { value: "semi_furnished", label: "Semi furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];

export const sizeUnitOptions = [
  { value: "", label: "Unit" },
  { value: "sqm", label: "sqm" },
  { value: "sqft", label: "sqft" },
  { value: "katha", label: "katha" },
  { value: "bigha", label: "bigha" },
];

export const pricePeriodOptions = [
  { value: "", label: "Period" },
  { value: "total", label: "Total" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export const mediaTypeOptions = [
  { value: "property_photo", label: "Property photo" },
  { value: "floor_plan", label: "Floor plan" },
  { value: "neighborhood_image", label: "Neighborhood image" },
  { value: "video", label: "Video" },
  { value: "virtual_tour", label: "Virtual tour" },
];

export const documentTypeOptions = [
  { value: "ownership_deed", label: "Ownership deed" },
  { value: "rental_authorization", label: "Rental authorization" },
  { value: "agency_authorization", label: "Agency authorization" },
  { value: "energy_certificate", label: "Energy certificate" },
  { value: "market_or_rera_permit", label: "Market/RERA permit" },
  { value: "electricity_bill", label: "Electricity bill" },
  { value: "gas_bill", label: "Gas bill" },
  { value: "water_bill", label: "Water bill" },
  { value: "property_tax_receipt", label: "Property tax receipt" },
  { value: "building_permit", label: "Building permit" },
  { value: "other", label: "Other" },
];

export const documentVerificationOptions = [
  { value: "not_provided", label: "Not provided" },
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

export const listingStatusOptions = [
  { value: "", label: "Any status" },
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending review" },
  { value: "changes_requested", label: "Changes requested" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
  { value: "under_offer", label: "Under offer" },
  { value: "sold", label: "Sold" },
  { value: "rented_out", label: "Rented out" },
  { value: "rejected", label: "Rejected" },
  { value: "paused", label: "Paused" },
  { value: "expired", label: "Expired" },
  { value: "subscription_suspended", label: "Subscription suspended" },
  { value: "archived", label: "Archived" },
];

export const categoryCards = [
  {
    key: "apartment",
    label: "Apartments",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "villa",
    label: "Villas",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "house",
    label: "Houses",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "studio",
    label: "Studios",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "office",
    label: "Offices",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "land",
    label: "Land",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
  },
];

export const placeholderListingImage =
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function formatLabel(value) {
  return value ? value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Not available";
}

export function parseDecimal(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function formatMoney(amount, _currencyCode = "BDT", period = "") {
  const value = parseDecimal(amount);
  if (value === null) return "Price on request";

  const formatted = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  })
    .formatToParts(value)
    .map((part) => (part.type === "currency" ? "৳" : part.value))
    .join("");

  if (period === "monthly") return `${formatted}/mo`;
  if (period === "yearly") return `${formatted}/yr`;
  return formatted;
}

export function formatDateTime(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function getListingUuid(listing) {
  const candidate = listing?.id || listing?.listing_id || listing?.uuid;
  return typeof candidate === "string" && uuidPattern.test(candidate) ? candidate : null;
}

export function getListingPublicId(listing) {
  return listing?.public_id || listing?.slug || listing?.id || getListingUuid(listing);
}

export function getListingLocation(listing) {
  return [listing?.neighborhood, listing?.district_area, listing?.city, listing?.country_code].filter(Boolean).join(", ");
}

function getApiBaseUrl() {
  return (import.meta.env?.VITE_API_BASE_URL || "").replace(/\/$/, "");
}

function resolveImageUrl(value) {
  if (typeof value !== "string") return "";

  const url = value.trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (/^\/\//.test(url)) {
    const protocol = typeof window !== "undefined" ? window.location?.protocol || "https:" : "https:";
    return `${protocol}${url}`;
  }
  if (url.startsWith("/")) return getApiBaseUrl() ? `${getApiBaseUrl()}${url}` : url;

  return "";
}

function getFirstImageUrlFromMap(map) {
  if (!map || typeof map !== "object") return "";

  const fields = [
    "public_url",
    "cover_photo_url",
    "cover_image_url",
    "primary_image_url",
    "secure_url",
    "cdn_url",
    "signed_url",
    "url",
    "image_url",
    "photo_url",
    "file_url",
    "download_url",
    "original",
    "original_url",
    "large",
    "large_url",
    "medium",
    "medium_url",
    "thumbnail",
    "thumbnail_url",
    "external_url",
    "src",
    "href",
    "file_key",
  ];

  for (const field of fields) {
    const resolved = resolveImageUrl(map[field]);
    if (resolved) return resolved;
  }

  return "";
}

const urlMapFields = ["urls", "variants", "renditions", "sources"];
const nestedCollectionFields = [
  "images",
  "photos",
  "gallery",
  "listing_images",
  "image_urls",
  "photo_urls",
  "media",
  "media_assets",
  "listing_media",
  "media_images",
  "property_media",
  "property_images",
  "property_photos",
  "property_photo",
  "floor_plans",
  "floor_plan",
  "neighborhood_images",
  "attachments",
  "assets",
  "files",
  "items",
  "results",
];
const nestedSingleFields = ["image", "photo", "file", "asset", "cover_photo", "cover_image", "primary_image", "thumbnail"];

function uniqueUrls(urls) {
  return [...new Set(urls.filter(Boolean))];
}

function getLikelyImageValues(map) {
  if (!map || Array.isArray(map) || typeof map !== "object") return [];

  return Object.entries(map)
    .filter(([key, value]) => {
      if (!Array.isArray(value)) return false;
      const normalized = key.toLowerCase();
      return ["image", "photo", "floor", "cover", "gallery", "media", "asset"].some((token) => normalized.includes(token));
    })
    .flatMap(([, value]) => value);
}

function getImageUrlsFromCollection(collection, seen) {
  if (!collection) return [];
  const items = Array.isArray(collection) ? sortMediaItems(collection) : [collection];

  return items.flatMap((item) => {
    if (!isImageMedia(item)) return [];
    return getMediaUrls(item, seen);
  });
}

function getNestedImageUrls(media, seen) {
  if (!media || typeof media !== "object") return [];
  if (seen.has(media)) return [];
  seen.add(media);

  const direct = getFirstImageUrlFromMap(media);
  if (direct) return [direct];

  const urls = [];

  for (const field of urlMapFields) {
    const value = media[field];
    if (!value) continue;
    if (Array.isArray(value)) {
      urls.push(...getImageUrlsFromCollection(value, seen));
      continue;
    }
    urls.push(getFirstImageUrlFromMap(value));
    urls.push(...getImageUrlsFromCollection(getLikelyImageValues(value), seen));
  }

  for (const field of nestedCollectionFields) {
    urls.push(...getImageUrlsFromCollection(media[field], seen));
  }

  for (const field of nestedSingleFields) {
    urls.push(...getMediaUrls(media[field], seen));
  }

  urls.push(...getImageUrlsFromCollection(getLikelyImageValues(media), seen));

  return uniqueUrls(urls);
}

function isImageMedia(media) {
  if (!media || typeof media !== "object") return true;

  const mimeType = media.mime_type || media.content_type || media.file_type;
  if (typeof mimeType === "string") {
    if (mimeType.startsWith("image/")) return true;
    if (mimeType.startsWith("video/") || mimeType.startsWith("application/")) return false;
  }

  const mediaType = media.media_type || media.type || media.kind;
  if (typeof mediaType === "string") {
    const normalized = mediaType.toLowerCase();
    if (normalized.includes("video") || normalized.includes("tour") || normalized.includes("document")) return false;
    if (normalized.includes("photo") || normalized.includes("image") || normalized.includes("floor_plan")) return true;
  }

  return true;
}

function sortMediaItems(items) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      if (Boolean(a.item?.is_cover) !== Boolean(b.item?.is_cover)) return a.item?.is_cover ? -1 : 1;
      const aOrder = Number.isFinite(Number(a.item?.sort_order)) ? Number(a.item.sort_order) : a.index;
      const bOrder = Number.isFinite(Number(b.item?.sort_order)) ? Number(b.item.sort_order) : b.index;
      return aOrder - bOrder;
    })
    .map(({ item }) => item);
}

export function getMediaUrls(media, seen = new WeakSet()) {
  if (typeof media === "string") return uniqueUrls([resolveImageUrl(media)]);
  return getNestedImageUrls(media, seen instanceof WeakSet ? seen : new WeakSet());
}

export function getMediaUrl(media, seen = new WeakSet()) {
  return getMediaUrls(media, seen)[0] || "";
}

export function getListingImages(listing) {
  const imageGroups = [
    listing?.images,
    listing?.photos,
    listing?.gallery,
    listing?.listing_images,
    listing?.image_urls,
    listing?.photo_urls,
    listing?.media_images,
    listing?.property_images,
    listing?.property_photos,
  ];

  const mediaGroups = [
    listing?.media,
    listing?.media_assets,
    listing?.listing_media,
    listing?.property_media,
    listing?.attachments,
    listing?.assets,
  ];

  const urls = [
    ...getMediaUrls(listing?.cover_photo_url),
    ...getMediaUrls(listing?.cover_image_url),
    ...getMediaUrls(listing?.primary_image_url),
    ...getMediaUrls(listing?.image_url),
    ...getMediaUrls(listing?.thumbnail_url),
    ...getMediaUrls(listing?.cover_photo),
    ...getMediaUrls(listing?.cover_image),
    ...imageGroups.flatMap((group) => getImageUrlsFromCollection(group, new WeakSet())),
    ...mediaGroups.flatMap((group) => getImageUrlsFromCollection(group, new WeakSet())),
  ];

  const unique = uniqueUrls(urls);
  return unique.length > 0 ? unique : [placeholderListingImage];
}

export function normalizePublicListingPayload(payload) {
  if (!payload || Array.isArray(payload) || typeof payload !== "object") return payload;

  const nestedListing = payload.listing || payload.item || payload.result || payload.data?.listing || payload.data;
  if (!nestedListing || Array.isArray(nestedListing) || typeof nestedListing !== "object") return payload;

  return {
    ...payload,
    ...nestedListing,
    images:
      nestedListing.images ||
      payload.images ||
      payload.data?.images ||
      payload.photos ||
      payload.data?.photos ||
      payload.gallery ||
      payload.data?.gallery ||
      payload.media_images ||
      payload.data?.media_images,
    media:
      nestedListing.media ||
      payload.media ||
      payload.data?.media ||
      payload.media_assets ||
      payload.data?.media_assets ||
      payload.listing_media ||
      payload.data?.listing_media ||
      payload.property_media ||
      payload.data?.property_media ||
      payload.attachments,
  };
}

export function toSearchParams(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((item) => searchParams.append(key, item));
      return;
    }
    searchParams.set(key, String(value));
  });

  return searchParams;
}

export function getDeviceType() {
  if (typeof window === "undefined") return "unknown";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function getSessionId() {
  if (typeof window === "undefined") return "anonymous";
  const key = "grihoo_listing_session_id";
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;

  const next = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`;
  window.sessionStorage.setItem(key, next);
  return next;
}

export function cleanListingPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (value === "") return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined;
    }),
  );
}
