import {
  AlertCircle,
  Archive,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  ImagePlus,
  Loader2,
  MapPin,
  Pencil,
  PlusCircle,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  Upload,
  UserPlus,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import {
  adminApproveListing,
  adminAssignListing,
  adminBulkApproveListings,
  adminDeleteListingDocument,
  adminDeleteListingMedia,
  adminEnrichListing,
  adminPublishListing,
  adminRejectListing,
  adminRequestListingChanges,
  adminSubmitListing,
  adminUnpublishListing,
  adminUpdateDocumentVerification,
  adminUploadListingDocument,
  adminUploadListingMedia,
  archiveListing,
  createAdminListing,
  getAdminListing,
  listAdminListings,
  updateListing,
} from "../../lib/adminApi";
import { hasGoogleMapsApiKey, loadGoogleMapsApi } from "../../lib/googleMapsApi";
import {
  assetTypeOptions,
  cleanListingPayload,
  documentTypeOptions,
  documentVerificationOptions,
  formatDateTime,
  formatLabel,
  formatMoney,
  fullViewPolicyOptions,
  furnishedStatusOptions,
  getListingLocation,
  getListingPublicId,
  getListingUuid,
  listingPurposeOptions,
  listingStatusOptions,
  mediaTypeOptions,
  pricePeriodOptions,
  propertyCategoryOptions,
  propertyConditionOptions,
  sizeUnitOptions,
} from "../../lib/listingUtils";

const statusStyles = {
  draft: "bg-gray-100 text-gray-600",
  pending_review: "bg-amber-50 text-amber-700",
  changes_requested: "bg-orange-50 text-orange-700",
  approved: "bg-blue-50 text-blue-700",
  published: "bg-emerald-50 text-emerald-700",
  under_offer: "bg-purple-50 text-purple-700",
  sold: "bg-gray-900 text-white",
  rented_out: "bg-gray-900 text-white",
  rejected: "bg-red-50 text-red-700",
  paused: "bg-slate-100 text-slate-700",
  expired: "bg-gray-100 text-gray-500",
  subscription_suspended: "bg-red-50 text-red-700",
  archived: "bg-gray-100 text-gray-500",
};

const blankListingForm = {
  listing_purpose: "sale",
  property_category: "private",
  asset_type: "apartment",
  full_view_policy: "verified_premium_only",
  language_code: "en",
  country_code: "BD",
  city: "",
  state_province: "",
  district_area: "",
  neighborhood: "",
  street_line_1: "",
  street_line_2: "",
  postal_code: "",
  latitude: "",
  longitude: "",
  hide_exact_address: false,
  currency_code: "BDT",
  price_amount: "",
  price_period: "total",
  service_charge_amount: "",
  deposit_amount: "",
  negotiable: false,
  size_value: "",
  size_unit: "sqm",
  bedrooms: "",
  bathrooms: "",
  living_rooms: "",
  floor_number: "",
  total_floors: "",
  parking_spaces: "",
  year_built: "",
  property_condition: "",
  furnished_status: "",
  available_from: "",
  company_user_id: "",
  seller_id: "",
};

const numberFields = new Set([
  "latitude",
  "longitude",
  "price_amount",
  "service_charge_amount",
  "deposit_amount",
  "size_value",
  "bedrooms",
  "bathrooms",
  "living_rooms",
  "floor_number",
  "total_floors",
  "parking_spaces",
  "year_built",
]);

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status] || "bg-gray-100 text-gray-600"}`}>
      {formatLabel(status)}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-gray-900">{value || "Not available"}</p>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-5">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button type="button" className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-800" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function toListingForm(listing) {
  return {
    ...blankListingForm,
    ...Object.fromEntries(
      Object.keys(blankListingForm).map((key) => [key, listing?.[key] === null || listing?.[key] === undefined ? blankListingForm[key] : listing[key]]),
    ),
    currency_code: "BDT",
  };
}

function toListingCopy(listing) {
  return {
    title: listing?.title || "",
    short_description: listing?.short_description || "",
    description: listing?.description || "",
  };
}

function toListingPayload(form, includeEmpty = false) {
  const payload = { currency_code: "BDT" };

  Object.entries(form).forEach(([key, value]) => {
    if (!includeEmpty && (value === "" || value === undefined)) return;
    if (numberFields.has(key) && value !== "" && value !== null && value !== undefined) {
      payload[key] = Number(value);
      return;
    }
    payload[key] = key === "currency_code" ? "BDT" : value;
  });

  return cleanListingPayload(payload);
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      {children}
    </label>
  );
}

function getAddressComponent(components = [], type) {
  return components.find((component) => component.types?.includes(type));
}

function getAddressComponentText(components, type, variant = "longText") {
  return getAddressComponent(components, type)?.[variant] || "";
}

function getLatLngValue(location, method) {
  if (!location) return "";
  const value = location[method];
  return typeof value === "function" ? value.call(location) : value;
}

function googlePlaceToAddress(place) {
  const components = place?.addressComponents || [];
  const streetNumber = getAddressComponentText(components, "street_number");
  const route = getAddressComponentText(components, "route");
  const sublocality =
    getAddressComponentText(components, "sublocality_level_1") ||
    getAddressComponentText(components, "sublocality") ||
    getAddressComponentText(components, "neighborhood");
  const city =
    getAddressComponentText(components, "locality") ||
    getAddressComponentText(components, "postal_town") ||
    getAddressComponentText(components, "administrative_area_level_2");
  const districtArea =
    getAddressComponentText(components, "administrative_area_level_2") ||
    getAddressComponentText(components, "sublocality_level_2") ||
    sublocality;
  const streetLine = [streetNumber, route].filter(Boolean).join(" ");

  return {
    country_code: getAddressComponentText(components, "country", "shortText").toUpperCase(),
    city,
    state_province: getAddressComponentText(components, "administrative_area_level_1"),
    district_area: districtArea,
    neighborhood: sublocality,
    street_line_1: streetLine || place.formattedAddress || place.displayName || "",
    street_line_2: "",
    postal_code: getAddressComponentText(components, "postal_code"),
    latitude: getLatLngValue(place.location, "lat"),
    longitude: getLatLngValue(place.location, "lng"),
  };
}

function GoogleAddressAutocompleteField({ countryCode, value, onChange, onSelect }) {
  const containerRef = useRef(null);
  const [error, setError] = useState("");
  const enabled = hasGoogleMapsApiKey();
  const normalizedCountryCode = (countryCode || "BD").trim().toLowerCase();

  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!enabled) return undefined;

    let autocompleteElement = null;
    let cancelled = false;

    async function initializeAutocomplete() {
      setError("");

      try {
        const google = await loadGoogleMapsApi();
        const { PlaceAutocompleteElement } = await google.maps.importLibrary("places");
        if (cancelled || !containerRef.current) return;

        autocompleteElement = new PlaceAutocompleteElement();
        autocompleteElement.includedRegionCodes = [normalizedCountryCode];
        autocompleteElement.setAttribute("aria-label", "Search address");
        autocompleteElement.style.display = "block";
        autocompleteElement.style.width = "100%";

        autocompleteElement.addEventListener("gmp-select", async (event) => {
          const placePrediction = event.placePrediction || event.detail?.placePrediction;
          if (!placePrediction) return;

          const place = placePrediction.toPlace();
          await place.fetchFields({
            fields: ["displayName", "formattedAddress", "location", "addressComponents"],
          });
          onSelectRef.current(googlePlaceToAddress(place));
        });

        containerRef.current.replaceChildren(autocompleteElement);
      } catch (apiError) {
        if (!cancelled) setError(apiError.message || "Unable to load Google Places autocomplete.");
      }
    }

    initializeAutocomplete();

    return () => {
      cancelled = true;
      if (autocompleteElement?.parentNode) autocompleteElement.parentNode.removeChild(autocompleteElement);
    };
  }, [enabled, normalizedCountryCode]);

  return (
    <div>
      {enabled && <div ref={containerRef} className="min-h-[42px] rounded-lg border border-ink/10 bg-white p-1" />}
      <input
        className={`input-field ${enabled ? "mt-2" : ""}`}
        name="address-1"
        autoComplete="address-line1"
        placeholder={enabled ? "Selected street line or manual override" : "Set VITE_GOOGLE_MAPS_API_KEY to enable Google suggestions"}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
      {!enabled && (
        <p className="mt-1 text-xs text-amber-600">Google Places autocomplete is disabled until `VITE_GOOGLE_MAPS_API_KEY` is configured.</p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function ListingWizard({ initialListing, onClose, onSaved }) {
  const [step, setStep] = useState(0);
  const [listing, setListing] = useState(initialListing || null);
  const [form, setForm] = useState(() => toListingForm(initialListing));
  const [copyForm, setCopyForm] = useState(() => toListingCopy(initialListing));
  const [mediaType, setMediaType] = useState("property_photo");
  const [mediaFile, setMediaFile] = useState(null);
  const [documentType, setDocumentType] = useState("ownership_deed");
  const [documentFile, setDocumentFile] = useState(null);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const listingId = getListingUuid(listing);
  const steps = ["Details", "Media", "Documents", "Review"];

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function applyAddress(address) {
    setForm((current) => ({
      ...current,
      country_code: address.country_code || current.country_code,
      city: address.city || current.city,
      state_province: address.state_province || current.state_province,
      district_area: address.district_area || current.district_area,
      street_line_1: address.street_line_1 || current.street_line_1,
      street_line_2: address.street_line_2 || current.street_line_2,
      postal_code: address.postal_code || current.postal_code,
      latitude: address.latitude || current.latitude,
      longitude: address.longitude || current.longitude,
    }));
  }

  async function refreshListing(nextListingId = listingId) {
    if (!nextListingId) return null;
    const refreshed = await getAdminListing(nextListingId);
    setListing(refreshed);
    setForm(toListingForm(refreshed));
    setCopyForm(toListingCopy(refreshed));
    onSaved?.(refreshed);
    return refreshed;
  }

  async function saveDetails(event) {
    event.preventDefault();
    setActionLoading("details");
    setError("");
    setNotice("");

    try {
      const payload = toListingPayload(form);
      const saved = listingId ? await updateListing(listingId, payload) : await createAdminListing(payload);
      setListing(saved);
      setForm(toListingForm(saved));
      setCopyForm(toListingCopy(saved));
      setNotice(listingId ? "Listing details updated." : "Draft listing created.");
      onSaved?.(saved);
      if (!listingId) setStep(1);
    } catch (apiError) {
      setError(apiError.message || "Unable to save listing details.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleMediaUpload(event) {
    event.preventDefault();
    if (!listingId || !mediaFile) return;
    setActionLoading("media");
    setError("");
    setNotice("");

    try {
      await adminUploadListingMedia(listingId, mediaType, mediaFile);
      setMediaFile(null);
      await refreshListing();
      setNotice("Media uploaded.");
    } catch (apiError) {
      setError(apiError.message || "Unable to upload media.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleDocumentUpload(event) {
    event.preventDefault();
    if (!listingId || !documentFile) return;
    setActionLoading("document");
    setError("");
    setNotice("");

    try {
      await adminUploadListingDocument(listingId, documentType, documentFile);
      setDocumentFile(null);
      await refreshListing();
      setNotice("Document uploaded.");
    } catch (apiError) {
      setError(apiError.message || "Unable to upload document.");
    } finally {
      setActionLoading("");
    }
  }

  async function runWizardAction(key, action, successMessage) {
    if (!listingId) return;
    setActionLoading(key);
    setError("");
    setNotice("");

    try {
      await action();
      await refreshListing();
      setNotice(successMessage);
    } catch (apiError) {
      setError(apiError.message || "Action failed.");
    } finally {
      setActionLoading("");
    }
  }

  async function deleteMedia(mediaId) {
    await runWizardAction(`delete-media-${mediaId}`, () => adminDeleteListingMedia(listingId, mediaId), "Media deleted.");
  }

  async function deleteDocument(documentId) {
    await runWizardAction(`delete-document-${documentId}`, () => adminDeleteListingDocument(listingId, documentId), "Document deleted.");
  }

  async function updateDocumentStatus(documentId, verificationStatus) {
    await runWizardAction(
      `verify-document-${documentId}`,
      () => adminUpdateDocumentVerification(listingId, documentId, verificationStatus),
      "Document verification updated.",
    );
  }

  async function saveGeneratedCopy(event) {
    event.preventDefault();
    if (!listingId) return;

    setActionLoading("copy");
    setError("");
    setNotice("");

    try {
      const saved = await updateListing(listingId, cleanListingPayload(copyForm));
      setListing(saved);
      setCopyForm(toListingCopy(saved));
      onSaved?.(saved);
      setNotice("Generated copy updated.");
    } catch (apiError) {
      setError(apiError.message || "Unable to update generated copy.");
    } finally {
      setActionLoading("");
    }
  }

  return (
    <Modal title={listingId ? "Manage listing" : "Create listing"} onClose={onClose}>
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex flex-wrap gap-2">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${step === index ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}
              onClick={() => setStep(index)}
              disabled={index > 0 && !listingId}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {notice}
          </div>
        )}

        {step === 0 && (
          <form className="space-y-6" onSubmit={saveDetails}>
            <section>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">Core listing</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Purpose">
                  <select className="input-field" value={form.listing_purpose} onChange={(event) => updateField("listing_purpose", event.target.value)} required>
                    {listingPurposeOptions.filter((option) => option.value).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </Field>
                <Field label="Category">
                  <select className="input-field" value={form.property_category} onChange={(event) => updateField("property_category", event.target.value)} required>
                    {propertyCategoryOptions.filter((option) => option.value).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </Field>
                <Field label="Asset type">
                  <select className="input-field" value={form.asset_type} onChange={(event) => updateField("asset_type", event.target.value)} required>
                    {assetTypeOptions.filter((option) => option.value).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </Field>
                <Field label="Full view policy">
                  <select className="input-field" value={form.full_view_policy} onChange={(event) => updateField("full_view_policy", event.target.value)}>
                    {fullViewPolicyOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </Field>
                <Field label="Language">
                  <input className="input-field" value={form.language_code} maxLength={10} onChange={(event) => updateField("language_code", event.target.value)} />
                </Field>
                <Field label="Currency">
                  <input className="input-field uppercase" value="BDT" readOnly />
                </Field>
              </div>
            </section>

            <section>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">Address</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Street line 1">
                  <GoogleAddressAutocompleteField
                    countryCode={form.country_code}
                    value={form.street_line_1}
                    onChange={(value) => updateField("street_line_1", value)}
                    onSelect={applyAddress}
                  />
                </Field>
                <Field label="Street line 2">
                  <input
                    className="input-field"
                    name="address-2"
                    autoComplete="address-line2"
                    value={form.street_line_2}
                    onChange={(event) => updateField("street_line_2", event.target.value)}
                  />
                </Field>
                <Field label="Country code">
                  <input
                    className="input-field uppercase"
                    name="country"
                    autoComplete="country"
                    value={form.country_code}
                    maxLength={2}
                    onChange={(event) => updateField("country_code", event.target.value.toUpperCase())}
                  />
                </Field>
                <Field label="City">
                  <input
                    className="input-field"
                    name="city"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(event) => updateField("city", event.target.value)}
                  />
                </Field>
                <Field label="State/province">
                  <input
                    className="input-field"
                    name="state"
                    autoComplete="address-level1"
                    value={form.state_province}
                    onChange={(event) => updateField("state_province", event.target.value)}
                  />
                </Field>
                <Field label="District/area">
                  <input
                    className="input-field"
                    name="district"
                    autoComplete="address-level3"
                    value={form.district_area}
                    onChange={(event) => updateField("district_area", event.target.value)}
                  />
                </Field>
                <Field label="Neighborhood">
                  <input className="input-field" value={form.neighborhood} onChange={(event) => updateField("neighborhood", event.target.value)} />
                </Field>
                <Field label="Postal code">
                  <input
                    className="input-field"
                    name="zip"
                    autoComplete="postal-code"
                    value={form.postal_code}
                    onChange={(event) => updateField("postal_code", event.target.value)}
                  />
                </Field>
                <Field label="Hide exact address">
                  <label className="flex h-[42px] items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 text-sm">
                    <input type="checkbox" className="h-4 w-4 accent-forest" checked={Boolean(form.hide_exact_address)} onChange={(event) => updateField("hide_exact_address", event.target.checked)} />
                    Hide exact address publicly
                  </label>
                </Field>
                <Field label="Latitude">
                  <input className="input-field" type="number" step="any" value={form.latitude} onChange={(event) => updateField("latitude", event.target.value)} />
                </Field>
                <Field label="Longitude">
                  <input className="input-field" type="number" step="any" value={form.longitude} onChange={(event) => updateField("longitude", event.target.value)} />
                </Field>
              </div>
            </section>

            <section>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">Price and specifications</h4>
              <div className="grid gap-4 md:grid-cols-4">
                <Field label="Price">
                  <input className="input-field" type="number" min="0" step="any" value={form.price_amount} onChange={(event) => updateField("price_amount", event.target.value)} />
                </Field>
                <Field label="Price period">
                  <select className="input-field" value={form.price_period} onChange={(event) => updateField("price_period", event.target.value)}>
                    {pricePeriodOptions.filter((option) => option.value).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </Field>
                <Field label="Service charge">
                  <input className="input-field" type="number" min="0" step="any" value={form.service_charge_amount} onChange={(event) => updateField("service_charge_amount", event.target.value)} />
                </Field>
                <Field label="Deposit">
                  <input className="input-field" type="number" min="0" step="any" value={form.deposit_amount} onChange={(event) => updateField("deposit_amount", event.target.value)} />
                </Field>
                <Field label="Size">
                  <input className="input-field" type="number" min="0" step="any" value={form.size_value} onChange={(event) => updateField("size_value", event.target.value)} />
                </Field>
                <Field label="Size unit">
                  <select className="input-field" value={form.size_unit} onChange={(event) => updateField("size_unit", event.target.value)}>
                    {sizeUnitOptions.filter((option) => option.value).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </Field>
                <Field label="Bedrooms">
                  <input className="input-field" type="number" min="0" value={form.bedrooms} onChange={(event) => updateField("bedrooms", event.target.value)} />
                </Field>
                <Field label="Bathrooms">
                  <input className="input-field" type="number" min="0" value={form.bathrooms} onChange={(event) => updateField("bathrooms", event.target.value)} />
                </Field>
                <Field label="Living rooms">
                  <input className="input-field" type="number" min="0" value={form.living_rooms} onChange={(event) => updateField("living_rooms", event.target.value)} />
                </Field>
                <Field label="Floor">
                  <input className="input-field" type="number" value={form.floor_number} onChange={(event) => updateField("floor_number", event.target.value)} />
                </Field>
                <Field label="Total floors">
                  <input className="input-field" type="number" min="0" value={form.total_floors} onChange={(event) => updateField("total_floors", event.target.value)} />
                </Field>
                <Field label="Parking spaces">
                  <input className="input-field" type="number" min="0" value={form.parking_spaces} onChange={(event) => updateField("parking_spaces", event.target.value)} />
                </Field>
                <Field label="Year built">
                  <input className="input-field" type="number" min="0" value={form.year_built} onChange={(event) => updateField("year_built", event.target.value)} />
                </Field>
                <Field label="Condition">
                  <select className="input-field" value={form.property_condition} onChange={(event) => updateField("property_condition", event.target.value)}>
                    {propertyConditionOptions.map((option) => <option key={option.value || "any"} value={option.value}>{option.label}</option>)}
                  </select>
                </Field>
                <Field label="Furnishing">
                  <select className="input-field" value={form.furnished_status} onChange={(event) => updateField("furnished_status", event.target.value)}>
                    {furnishedStatusOptions.map((option) => <option key={option.value || "any"} value={option.value}>{option.label}</option>)}
                  </select>
                </Field>
                <Field label="Available from">
                  <input className="input-field" type="date" value={form.available_from || ""} onChange={(event) => updateField("available_from", event.target.value)} />
                </Field>
              </div>
            </section>

            <section>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">Ownership and assignment</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Seller user id">
                  <input className="input-field" value={form.seller_id} onChange={(event) => updateField("seller_id", event.target.value)} />
                </Field>
                <Field label="Company user id">
                  <input className="input-field" value={form.company_user_id} onChange={(event) => updateField("company_user_id", event.target.value)} />
                </Field>
              </div>
            </section>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
              <button type="submit" className="btn-primary" disabled={actionLoading === "details"}>
                {actionLoading === "details" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                {listingId ? "Save details" : "Create draft"}
              </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <form className="grid gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 md:grid-cols-[220px_1fr_auto]" onSubmit={handleMediaUpload}>
              <select className="input-field bg-white" value={mediaType} onChange={(event) => setMediaType(event.target.value)}>
                {mediaTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <input className="input-field bg-white" type="file" onChange={(event) => setMediaFile(event.target.files?.[0] || null)} />
              <button className="btn-primary" disabled={!mediaFile || actionLoading === "media"}>
                {actionLoading === "media" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload
              </button>
            </form>
            <div className="grid gap-3 md:grid-cols-2">
              {(listing?.media || []).length === 0 ? (
                <div className="rounded-lg border border-gray-100 bg-white p-6 text-center text-sm text-gray-400 md:col-span-2">
                  <ImagePlus className="mx-auto mb-2 h-6 w-6" />
                  No media uploaded.
                </div>
              ) : (
                listing.media.map((media) => (
                  <div key={media.id} className="rounded-lg border border-gray-100 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{formatLabel(media.media_type)}</p>
                        <p className="mt-1 break-all text-xs text-gray-400">{media.file_name || media.external_url || media.file_key || media.id}</p>
                        <p className="mt-1 text-xs text-gray-400">Order {media.sort_order} {media.is_cover ? "· cover" : ""}</p>
                      </div>
                      <button type="button" className="rounded-lg p-2 text-red-500 transition hover:bg-red-50" onClick={() => deleteMedia(media.id)} disabled={Boolean(actionLoading)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-5">
              <button className="btn-secondary" onClick={() => setStep(0)}>Back</button>
              <button className="btn-primary" onClick={() => setStep(2)}>Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <form className="grid gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 md:grid-cols-[240px_1fr_auto]" onSubmit={handleDocumentUpload}>
              <select className="input-field bg-white" value={documentType} onChange={(event) => setDocumentType(event.target.value)}>
                {documentTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <input className="input-field bg-white" type="file" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} />
              <button className="btn-primary" disabled={!documentFile || actionLoading === "document"}>
                {actionLoading === "document" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload
              </button>
            </form>
            <div className="grid gap-3">
              {(listing?.documents || []).length === 0 ? (
                <div className="rounded-lg border border-gray-100 bg-white p-6 text-center text-sm text-gray-400">
                  <FileText className="mx-auto mb-2 h-6 w-6" />
                  No documents uploaded.
                </div>
              ) : (
                listing.documents.map((document) => (
                  <div key={document.id} className="grid gap-3 rounded-lg border border-gray-100 bg-white p-4 md:grid-cols-[1fr_200px_auto] md:items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{formatLabel(document.document_type)}</p>
                      <p className="mt-1 text-xs text-gray-400">{document.file_name} · {document.content_type}</p>
                      <p className="mt-1 text-xs text-gray-400">Uploaded {formatDateTime(document.uploaded_at)}</p>
                    </div>
                    <select className="input-field" value={document.verification_status} onChange={(event) => updateDocumentStatus(document.id, event.target.value)} disabled={Boolean(actionLoading)}>
                      {documentVerificationOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <button type="button" className="rounded-lg p-2 text-red-500 transition hover:bg-red-50" onClick={() => deleteDocument(document.id)} disabled={Boolean(actionLoading)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-5">
              <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" onClick={() => setStep(3)}>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="grid gap-4 rounded-lg border border-gray-100 bg-white p-5 md:grid-cols-3">
              <DetailRow label="Status" value={formatLabel(listing?.status)} />
              <DetailRow label="AI review" value={formatLabel(listing?.ai_review_status)} />
              <DetailRow label="AI enrichment" value={formatLabel(listing?.ai_enrichment_status)} />
              <DetailRow label="Public id" value={listing?.public_id} />
              <DetailRow label="Seller id" value={listing?.seller_id} />
              <DetailRow label="Assigned to" value={listing?.assigned_to_id} />
            </div>

            <form className="space-y-4 rounded-lg border border-gray-100 bg-white p-5" onSubmit={saveGeneratedCopy}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">AI generated listing copy</h4>
                  <p className="mt-1 text-sm text-gray-400">Run enrichment, review the generated copy, and patch only copy fields if it needs cleanup.</p>
                </div>
                <button className="btn-secondary py-2" type="submit" disabled={!listingId || actionLoading === "copy"}>
                  {actionLoading === "copy" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                  Save copy
                </button>
              </div>
              <Field label="Generated title">
                <input
                  className="input-field"
                  value={copyForm.title}
                  maxLength={500}
                  onChange={(event) => setCopyForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Run enrichment to generate a title"
                />
              </Field>
              <Field label="Generated short description">
                <input
                  className="input-field"
                  value={copyForm.short_description}
                  maxLength={1000}
                  onChange={(event) => setCopyForm((current) => ({ ...current, short_description: event.target.value }))}
                  placeholder="Run enrichment to generate a one-liner"
                />
              </Field>
              <Field label="Generated description">
                <textarea
                  className="input-field min-h-32 resize-y"
                  value={copyForm.description}
                  onChange={(event) => setCopyForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Run enrichment to generate the full listing description"
                />
              </Field>
            </form>

            <div className="grid gap-3 md:grid-cols-3">
              <button className="btn-secondary" onClick={() => runWizardAction("submit", () => adminSubmitListing(listingId), "Listing submitted for review.")} disabled={Boolean(actionLoading)}>
                {actionLoading === "submit" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit
              </button>
              <button className="btn-secondary" onClick={() => runWizardAction("enrich", () => adminEnrichListing(listingId), "Listing enrichment started.")} disabled={Boolean(actionLoading)}>
                {actionLoading === "enrich" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Enrich
              </button>
              <button className="btn-secondary text-blue-700 hover:border-blue-200 hover:text-blue-800" onClick={() => runWizardAction("approve", () => adminApproveListing(listingId), "Listing approved.")} disabled={Boolean(actionLoading)}>
                {actionLoading === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                Approve
              </button>
              <button className="btn-primary" onClick={() => runWizardAction("publish", () => adminPublishListing(listingId), "Listing published.")} disabled={Boolean(actionLoading)}>
                {actionLoading === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Publish
              </button>
              <button className="btn-secondary" onClick={onClose}>Done</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function ListingManagementPage() {
  const [filters, setFilters] = useState({ page: 1, page_size: 20, status: "" });
  const [listings, setListings] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [wizardListing, setWizardListing] = useState(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [reasonAction, setReasonAction] = useState("");
  const [reason, setReason] = useState("");
  const [assignAdminId, setAssignAdminId] = useState("");
  const page = Number(filters.page || 1);
  const pageSize = Number(filters.page_size || 20);
  const hasNextPage = listings.length >= pageSize;
  const selectedUuid = getListingUuid(selectedListing) || getListingUuid(selectedCard);

  const queryParams = useMemo(() => ({
    ...filters,
    status: filters.status ? [filters.status] : undefined,
  }), [filters]);

  async function loadListings(nextFilters = filters) {
    setLoading(true);
    setError("");
    try {
      const params = {
        ...nextFilters,
        status: nextFilters.status ? [nextFilters.status] : undefined,
      };
      const response = await listAdminListings(params);
      setListings(Array.isArray(response) ? response : response?.items || []);
    } catch (apiError) {
      setError(apiError.message || "Unable to load listings.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadDetails(card) {
    setSelectedCard(card);
    setSelectedListing(null);
    setError("");
    setNotice("");
    const listingId = getListingUuid(card);

    if (!listingId) return;

    setDetailLoading(true);
    try {
      setSelectedListing(await getAdminListing(listingId));
    } catch (apiError) {
      setError(apiError.message || "Unable to load listing details.");
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    loadListings(queryParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value, page: field === "page" ? value : 1 }));
  }

  async function refreshCurrent(message = "") {
    if (message) setNotice(message);
    await loadListings(filters);
    if (selectedUuid) {
      try {
        setSelectedListing(await getAdminListing(selectedUuid));
      } catch {
        setSelectedListing(null);
      }
    }
  }

  async function runAction(key, action, successMessage) {
    if (!selectedUuid) return;
    setActionLoading(key);
    setError("");
    setNotice("");

    try {
      await action();
      await refreshCurrent(successMessage);
      setReasonAction("");
      setReason("");
      setAssignAdminId("");
    } catch (apiError) {
      setError(apiError.message || "Action failed.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleReasonAction(event) {
    event.preventDefault();
    if (!selectedUuid) return;

    if (reasonAction === "reject") {
      await runAction("reject", () => adminRejectListing(selectedUuid, reason.trim()), "Listing rejected.");
    } else if (reasonAction === "changes") {
      await runAction("changes", () => adminRequestListingChanges(selectedUuid, reason.trim()), "Changes requested.");
    } else if (reasonAction === "unpublish") {
      await runAction("unpublish", () => adminUnpublishListing(selectedUuid, reason.trim()), "Listing unpublished.");
    } else if (reasonAction === "archive") {
      await runAction("archive", () => archiveListing(selectedUuid), "Listing archived.");
    } else if (reasonAction === "assign") {
      await runAction("assign", () => adminAssignListing(selectedUuid, assignAdminId.trim()), "Listing assigned.");
    }
  }

  async function handleBulkApprove() {
    if (selectedIds.length === 0) return;
    setActionLoading("bulk-approve");
    setError("");
    setNotice("");
    try {
      const response = await adminBulkApproveListings(selectedIds);
      setSelectedIds([]);
      await refreshCurrent(`Bulk approve complete${response?.approved ? `: ${response.approved} approved` : ""}.`);
    } catch (apiError) {
      setError(apiError.message || "Unable to bulk approve listings.");
    } finally {
      setActionLoading("");
    }
  }

  function toggleSelected(listingId) {
    setSelectedIds((current) => (
      current.includes(listingId) ? current.filter((id) => id !== listingId) : [...current, listingId]
    ));
  }

  return (
    <AdminLayout title="Listings">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Listing management</h2>
            <p className="mt-1 text-sm text-gray-400">Create listings, review submissions, manage assets, and control publish status.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary py-2" onClick={() => loadListings(filters)} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button className="btn-secondary py-2" onClick={handleBulkApprove} disabled={selectedIds.length === 0 || actionLoading === "bulk-approve"}>
              {actionLoading === "bulk-approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />}
              Bulk approve
            </button>
            <button className="btn-primary py-2" onClick={() => { setWizardListing(null); setWizardOpen(true); }}>
              <PlusCircle className="h-4 w-4" />
              Create Listing
            </button>
          </div>
        </div>

        <div className="grid gap-3 rounded-xl border border-gray-100 bg-white p-4 md:grid-cols-5">
          <select className="input-field" value={filters.status || ""} onChange={(event) => updateFilter("status", event.target.value)}>
            {listingStatusOptions.map((option) => <option key={option.value || "any"} value={option.value}>{option.label}</option>)}
          </select>
          <input className="input-field" placeholder="Country code" value={filters.country_code || ""} onChange={(event) => updateFilter("country_code", event.target.value.toUpperCase())} maxLength={2} />
          <input className="input-field" placeholder="Seller UUID" value={filters.seller_id || ""} onChange={(event) => updateFilter("seller_id", event.target.value)} />
          <input className="input-field" placeholder="Assigned admin UUID" value={filters.assigned_to_id || ""} onChange={(event) => updateFilter("assigned_to_id", event.target.value)} />
          <select className="input-field" value={filters.page_size || 20} onChange={(event) => updateFilter("page_size", event.target.value)}>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}
        {notice && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {notice}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="w-10 p-4 text-left"></th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Listing</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Location</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Price</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Created</th>
                    <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-sm text-gray-400">
                        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                        Loading listings
                      </td>
                    </tr>
                  ) : listings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-sm text-gray-400">No listings found.</td>
                    </tr>
                  ) : (
                    listings.map((listing) => {
                      const listingId = getListingUuid(listing);
                      const publicId = getListingPublicId(listing);
                      return (
                        <tr key={publicId || listingId} className={`border-b border-gray-50 last:border-0 ${selectedCard === listing ? "bg-emerald-50/40" : ""}`}>
                          <td className="p-4">
                            <input type="checkbox" className="h-4 w-4 accent-forest" checked={listingId ? selectedIds.includes(listingId) : false} disabled={!listingId} onChange={() => toggleSelected(listingId)} />
                          </td>
                          <td className="max-w-[260px] p-4">
                            <p className="truncate font-semibold text-gray-900">{listing.title || "Untitled listing"}</p>
                            <p className="mt-1 truncate text-xs text-gray-400">{publicId || "No public id"}</p>
                          </td>
                          <td className="p-4"><StatusBadge status={listing.status} /></td>
                          <td className="max-w-[220px] truncate p-4 text-gray-500">{getListingLocation(listing) || "Not available"}</td>
                          <td className="p-4 text-gray-500">{formatMoney(listing.price_amount, listing.currency_code, listing.price_period)}</td>
                          <td className="p-4 text-gray-500">{formatDateTime(listing.created_at)}</td>
                          <td className="p-4 text-right">
                            <button className="rounded-lg px-3 py-1.5 text-xs font-semibold text-forest transition hover:bg-forest hover:text-white" onClick={() => loadDetails(listing)}>
                              Review
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 p-4 text-sm text-gray-500">
              <span>Page {page}</span>
              <div className="flex gap-2">
                <button className="btn-secondary py-1.5 text-xs" disabled={page <= 1 || loading} onClick={() => updateFilter("page", page - 1)}>Previous</button>
                <button className="btn-secondary py-1.5 text-xs" disabled={!hasNextPage || loading} onClick={() => updateFilter("page", page + 1)}>Next</button>
              </div>
            </div>
          </section>

          <aside className="rounded-xl border border-gray-100 bg-white p-5">
            {!selectedCard ? (
              <div className="grid min-h-80 place-items-center text-center text-sm text-gray-400">
                <div>
                  <FileText className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                  Select a listing to review.
                </div>
              </div>
            ) : detailLoading ? (
              <div className="grid min-h-80 place-items-center text-sm text-gray-400">
                <Loader2 className="mb-2 h-5 w-5 animate-spin" />
                Loading details
              </div>
            ) : !selectedUuid ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                  This admin list item does not include the listing UUID required by admin detail and action endpoints. Ask the API to include `id` in `GET /api/v1/admin/listings`.
                </div>
                <DetailRow label="Title" value={selectedCard.title} />
                <DetailRow label="Public id" value={selectedCard.public_id} />
                <DetailRow label="Status" value={formatLabel(selectedCard.status)} />
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{selectedListing?.title || selectedCard.title || "Untitled listing"}</h3>
                    <p className="mt-1 break-all text-xs text-gray-400">{selectedUuid}</p>
                  </div>
                  <StatusBadge status={selectedListing?.status || selectedCard.status} />
                </div>
                <div className="grid gap-4">
                  <DetailRow label="Public id" value={selectedListing?.public_id || selectedCard.public_id} />
                  <DetailRow label="Purpose" value={formatLabel(selectedListing?.listing_purpose || selectedCard.listing_purpose)} />
                  <DetailRow label="Asset type" value={formatLabel(selectedListing?.asset_type || selectedCard.asset_type)} />
                  <DetailRow label="Location" value={getListingLocation(selectedListing || selectedCard)} />
                  <DetailRow label="Price" value={formatMoney((selectedListing || selectedCard).price_amount, (selectedListing || selectedCard).currency_code, (selectedListing || selectedCard).price_period)} />
                  <DetailRow label="Seller id" value={selectedListing?.seller_id} />
                  <DetailRow label="Assigned to" value={selectedListing?.assigned_to_id} />
                  <DetailRow label="AI review" value={formatLabel(selectedListing?.ai_review_status)} />
                  <DetailRow label="AI enrichment" value={formatLabel(selectedListing?.ai_enrichment_status)} />
                  <DetailRow label="Rejection reason" value={selectedListing?.rejection_reason} />
                  <DetailRow label="Admin notes" value={selectedListing?.admin_notes} />
                </div>
                <div className="grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">
                  <button className="btn-primary px-3" onClick={() => { setWizardListing(selectedListing || selectedCard); setWizardOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                    Edit / Assets
                  </button>
                  <button className="btn-secondary px-3" onClick={() => runAction("submit", () => adminSubmitListing(selectedUuid), "Listing submitted.")} disabled={Boolean(actionLoading)}>
                    <Send className="h-4 w-4" />
                    Submit
                  </button>
                  <button className="btn-secondary px-3" onClick={() => runAction("enrich", () => adminEnrichListing(selectedUuid), "Listing enrichment started.")} disabled={Boolean(actionLoading)}>
                    <Sparkles className="h-4 w-4" />
                    Enrich
                  </button>
                  <button className="btn-secondary px-3 text-blue-700 hover:border-blue-200 hover:text-blue-800" onClick={() => runAction("approve", () => adminApproveListing(selectedUuid), "Listing approved.")} disabled={Boolean(actionLoading)}>
                    <BadgeCheck className="h-4 w-4" />
                    Approve
                  </button>
                  <button className="btn-secondary px-3 text-emerald-700 hover:border-emerald-200 hover:text-emerald-800" onClick={() => runAction("publish", () => adminPublishListing(selectedUuid), "Listing published.")} disabled={Boolean(actionLoading)}>
                    <CheckCircle2 className="h-4 w-4" />
                    Publish
                  </button>
                  <button className="btn-secondary px-3 text-orange-700 hover:border-orange-200 hover:text-orange-800" onClick={() => setReasonAction("changes")} disabled={Boolean(actionLoading)}>
                    <ClipboardCheck className="h-4 w-4" />
                    Request changes
                  </button>
                  <button className="btn-secondary px-3 text-red-600 hover:border-red-200 hover:text-red-700" onClick={() => setReasonAction("reject")} disabled={Boolean(actionLoading)}>
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button className="btn-secondary px-3 text-red-600 hover:border-red-200 hover:text-red-700" onClick={() => setReasonAction("unpublish")} disabled={Boolean(actionLoading)}>
                    <X className="h-4 w-4" />
                    Cancel / unpublish
                  </button>
                  <button className="btn-secondary px-3 text-gray-700 hover:border-gray-300" onClick={() => setReasonAction("archive")} disabled={Boolean(actionLoading)}>
                    <Archive className="h-4 w-4" />
                    Archive
                  </button>
                  <button className="btn-secondary px-3 sm:col-span-2" onClick={() => setReasonAction("assign")} disabled={Boolean(actionLoading)}>
                    <UserPlus className="h-4 w-4" />
                    Assign reviewer
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {wizardOpen && (
        <ListingWizard
          initialListing={wizardListing}
          onClose={() => { setWizardOpen(false); setWizardListing(null); }}
          onSaved={(saved) => {
            setSelectedListing(saved);
            loadListings(filters);
          }}
        />
      )}

      {reasonAction && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl" onSubmit={handleReasonAction}>
            <h3 className="text-base font-semibold text-gray-900">
              {reasonAction === "changes" ? "Request listing changes" : reasonAction === "assign" ? "Assign listing" : `${formatLabel(reasonAction)} listing`}
            </h3>
            {reasonAction === "assign" ? (
              <input className="input-field mt-4" placeholder="Admin UUID" value={assignAdminId} onChange={(event) => setAssignAdminId(event.target.value)} required />
            ) : reasonAction === "archive" ? (
              <p className="mt-2 text-sm text-gray-500">Archive this listing. This uses the available listing archive endpoint.</p>
            ) : (
              <textarea className="input-field mt-4 min-h-28 resize-none" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason or notes" required />
            )}
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={() => { setReasonAction(""); setReason(""); setAssignAdminId(""); }} disabled={Boolean(actionLoading)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={Boolean(actionLoading) || (reasonAction !== "archive" && reasonAction !== "assign" && !reason.trim()) || (reasonAction === "assign" && !assignAdminId.trim())}>
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
