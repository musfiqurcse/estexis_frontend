import {
  Archive,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Loader2,
  RefreshCw,
  Save,
  Settings2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import {
  archiveAdminInvestmentPreset,
  createAdminInvestmentPreset,
  listAdminInvestmentPresets,
  listAdminSubscriptionPlans,
  updateAdminInvestmentPreset,
  updateAdminSubscriptionPlan,
} from "../../lib/adminApi";

const fields = [
  "acquisition_price",
  "down_payment_amount",
  "closing_costs",
  "renovation_costs",
  "expected_monthly_rent",
  "vacancy_rate_pct",
  "property_tax_annual",
  "insurance_annual",
  "hoa_service_charge_annual",
  "maintenance_reserve_annual",
  "management_fee_pct",
  "other_expense_annual",
  "loan_amount",
  "interest_rate_pct",
  "amortization_years",
];

const nonCurrencyFields = new Set([
  "vacancy_rate_pct",
  "management_fee_pct",
  "interest_rate_pct",
  "amortization_years",
]);

const emptyPreset = {
  name: "",
  field_key: "vacancy_rate_pct",
  country_code: "BD",
  city: "",
  currency_code: "BDT",
  value: "",
  source_title: "",
  source_url: "",
  effective_from: "",
};

function label(value) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function PlanEditor({ plan, saving, onSave }) {
  const current = plan.entitlements || {};
  const [enabled, setEnabled] = useState(Boolean(current.investor_analytics_enabled));
  const [savedLimit, setSavedLimit] = useState(current.saved_scenarios_limit ?? "");
  const [comparisonLimit, setComparisonLimit] = useState(current.comparison_limit ?? 3);
  const [sharing, setSharing] = useState(Boolean(current.sharing_enabled));
  const [isPublic, setIsPublic] = useState(Boolean(plan.is_public));

  return (
    <article className="border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900">{plan.name}</h3>
            <span className={`px-2 py-0.5 text-xs font-semibold ${plan.is_free ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
              {plan.is_free ? "Free" : "Admin assigned"}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">{plan.slug}</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 bg-gray-900 px-3 text-sm font-semibold text-white disabled:opacity-50"
          disabled={saving}
          onClick={() =>
            onSave(plan.id, {
              is_public: isPublic,
              entitlements: {
                investor_analytics_enabled: enabled,
                saved_scenarios_limit: savedLimit === "" ? null : Number(savedLimit),
                comparison_limit: Number(comparisonLimit),
                sharing_enabled: sharing,
              },
            })
          }
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <input type="checkbox" className="h-4 w-4 accent-gray-900" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
          Analytics enabled
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <input type="checkbox" className="h-4 w-4 accent-gray-900" checked={sharing} onChange={(event) => setSharing(event.target.checked)} />
          Sharing enabled
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <input type="checkbox" className="h-4 w-4 accent-gray-900" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} />
          Public plan
        </label>
        <label className="text-xs font-semibold text-gray-500">
          Comparison limit
          <select className="mt-1 h-10 w-full border border-gray-200 px-3 text-sm" value={comparisonLimit} onChange={(event) => setComparisonLimit(event.target.value)}>
            {[2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-gray-500 sm:col-span-2">
          Saved scenario limit <span className="font-normal text-gray-400">(blank means unlimited)</span>
          <input className="mt-1 h-10 w-full border border-gray-200 px-3 text-sm" type="number" min="0" value={savedLimit} onChange={(event) => setSavedLimit(event.target.value)} />
        </label>
      </div>
    </article>
  );
}

export function InvestorSettingsPage() {
  const [tab, setTab] = useState("presets");
  const [presets, setPresets] = useState([]);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyPreset);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [presetData, planData] = await Promise.all([
        listAdminInvestmentPresets(),
        listAdminSubscriptionPlans(),
      ]);
      setPresets(presetData);
      setPlans(planData.filter((plan) => plan.product_key === "investor_analytics"));
    } catch (requestError) {
      setError(requestError.message || "Unable to load investor settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(emptyPreset);
    setEditingId(null);
  }

  function editPreset(preset) {
    setEditingId(preset.public_id);
    setForm({
      name: preset.name,
      field_key: preset.field_key,
      country_code: preset.country_code,
      city: preset.city || "",
      currency_code: preset.currency_code || "BDT",
      value: String(preset.value),
      source_title: preset.source_title,
      source_url: preset.source_url,
      effective_from: preset.effective_from || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitPreset(event) {
    event.preventDefault();
    setAction("preset");
    setError("");
    setNotice("");
    try {
      if (editingId) {
        await updateAdminInvestmentPreset(editingId, {
          name: form.name,
          value: form.value,
          source_title: form.source_title,
          source_url: form.source_url,
          effective_from: form.effective_from || null,
          reviewed_at: new Date().toISOString(),
          status: "active",
        });
        setNotice("Preset updated and review date refreshed.");
      } else {
        await createAdminInvestmentPreset({
          ...form,
          city: form.city || null,
          currency_code: nonCurrencyFields.has(form.field_key) ? null : form.currency_code,
          effective_from: form.effective_from || null,
        });
        setNotice("Reviewed preset created.");
      }
      resetForm();
      await load();
    } catch (requestError) {
      setError(requestError.message || "Unable to save preset.");
    } finally {
      setAction("");
    }
  }

  async function archivePreset(publicId) {
    setAction(publicId);
    setError("");
    try {
      await archiveAdminInvestmentPreset(publicId);
      setNotice("Preset archived.");
      await load();
    } catch (requestError) {
      setError(requestError.message || "Unable to archive preset.");
    } finally {
      setAction("");
    }
  }

  async function savePlan(planId, data) {
    setAction(planId);
    setError("");
    setNotice("");
    try {
      await updateAdminSubscriptionPlan(planId, data);
      setNotice("Subscription entitlements updated.");
      await load();
    } catch (requestError) {
      setError(requestError.message || "Unable to update plan.");
    } finally {
      setAction("");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">Investor product</p>
            <h1 className="mt-1 text-2xl font-semibold text-gray-900">Analytics settings</h1>
          </div>
          <button type="button" className="inline-flex h-10 items-center gap-2 border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700" onClick={load}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {(error || notice) && (
          <div className={`flex items-center gap-2 border-l-4 px-4 py-3 text-sm ${error ? "border-red-500 bg-red-50 text-red-700" : "border-emerald-500 bg-emerald-50 text-emerald-700"}`}>
            {notice && <CheckCircle2 className="h-4 w-4" />}
            {error || notice}
          </div>
        )}

        <div className="inline-flex border border-gray-200 bg-white p-1">
          <button type="button" className={`inline-flex h-10 items-center gap-2 px-4 text-sm font-semibold ${tab === "presets" ? "bg-gray-900 text-white" : "text-gray-500"}`} onClick={() => setTab("presets")}>
            <SlidersHorizontal className="h-4 w-4" /> Assumption presets
          </button>
          <button type="button" className={`inline-flex h-10 items-center gap-2 px-4 text-sm font-semibold ${tab === "plans" ? "bg-gray-900 text-white" : "text-gray-500"}`} onClick={() => setTab("plans")}>
            <Settings2 className="h-4 w-4" /> Subscription plans
          </button>
        </div>

        {loading ? (
          <div className="grid min-h-64 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
        ) : tab === "presets" ? (
          <>
            <form className="border border-gray-200 bg-white p-5" onSubmit={submitPreset}>
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <h2 className="font-semibold text-gray-900">{editingId ? "Edit reviewed preset" : "Add reviewed preset"}</h2>
                {editingId && (
                  <button type="button" className="grid h-9 w-9 place-items-center border border-gray-200 text-gray-500" aria-label="Cancel edit" onClick={resetForm}><X className="h-4 w-4" /></button>
                )}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label className="text-xs font-semibold text-gray-500">Name<input className="mt-1 h-10 w-full border border-gray-200 px-3 text-sm" required maxLength={200} value={form.name} onChange={(event) => updateForm("name", event.target.value)} /></label>
                <label className="text-xs font-semibold text-gray-500">Field<select className="mt-1 h-10 w-full border border-gray-200 px-3 text-sm" disabled={Boolean(editingId)} value={form.field_key} onChange={(event) => updateForm("field_key", event.target.value)}>{fields.map((field) => <option key={field} value={field}>{label(field)}</option>)}</select></label>
                <label className="text-xs font-semibold text-gray-500">Value<input className="mt-1 h-10 w-full border border-gray-200 px-3 text-sm" type="number" min="0" step="any" required value={form.value} onChange={(event) => updateForm("value", event.target.value)} /></label>
                {!nonCurrencyFields.has(form.field_key) && <label className="text-xs font-semibold text-gray-500">Currency<select className="mt-1 h-10 w-full border border-gray-200 px-3 text-sm" disabled={Boolean(editingId)} value={form.currency_code} onChange={(event) => updateForm("currency_code", event.target.value)}><option>BDT</option><option>EUR</option><option>AED</option><option>USD</option></select></label>}
                <label className="text-xs font-semibold text-gray-500">Country<input className="mt-1 h-10 w-full border border-gray-200 px-3 text-sm uppercase" minLength={2} maxLength={2} required disabled={Boolean(editingId)} value={form.country_code} onChange={(event) => updateForm("country_code", event.target.value.toUpperCase())} /></label>
                <label className="text-xs font-semibold text-gray-500">City<input className="mt-1 h-10 w-full border border-gray-200 px-3 text-sm" maxLength={200} disabled={Boolean(editingId)} value={form.city} onChange={(event) => updateForm("city", event.target.value)} /></label>
                <label className="text-xs font-semibold text-gray-500">Effective from<input className="mt-1 h-10 w-full border border-gray-200 px-3 text-sm" type="date" value={form.effective_from} onChange={(event) => updateForm("effective_from", event.target.value)} /></label>
                <label className="text-xs font-semibold text-gray-500 xl:col-span-2">Source title<input className="mt-1 h-10 w-full border border-gray-200 px-3 text-sm" required maxLength={500} value={form.source_title} onChange={(event) => updateForm("source_title", event.target.value)} /></label>
                <label className="text-xs font-semibold text-gray-500 xl:col-span-2">Source URL<input className="mt-1 h-10 w-full border border-gray-200 px-3 text-sm" type="url" required value={form.source_url} onChange={(event) => updateForm("source_url", event.target.value)} /></label>
              </div>
              <button type="submit" className="mt-5 inline-flex h-10 items-center gap-2 bg-gray-900 px-4 text-sm font-semibold text-white" disabled={action === "preset"}>{action === "preset" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{editingId ? "Update preset" : "Create preset"}</button>
            </form>

            <div className="overflow-x-auto border border-gray-200 bg-white">
              <table className="w-full min-w-[58rem] text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500"><tr><th className="px-4 py-3">Preset</th><th className="px-4 py-3">Scope</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Evidence</th><th className="px-4 py-3">Reviewed</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {presets.map((preset) => (
                    <tr key={preset.public_id} className={preset.status === "archived" ? "bg-gray-50 text-gray-400" : ""}>
                      <td className="px-4 py-3"><p className="font-semibold">{preset.name}</p><p className="mt-0.5 text-xs">{label(preset.field_key)}</p></td>
                      <td className="px-4 py-3">{preset.country_code}{preset.city ? ` / ${preset.city}` : ""}{preset.currency_code ? ` / ${preset.currency_code}` : ""}</td>
                      <td className="px-4 py-3 font-semibold tabular-nums">{preset.value}</td>
                      <td className="max-w-xs px-4 py-3"><a href={preset.source_url} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 truncate text-emerald-700 underline"><ExternalLink className="h-3.5 w-3.5 flex-none" />{preset.source_title}</a></td>
                      <td className="px-4 py-3">{new Date(preset.reviewed_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><div className="flex justify-end gap-2"><button type="button" className="grid h-9 w-9 place-items-center border border-gray-200 text-gray-500" title="Edit" onClick={() => editPreset(preset)}><Edit3 className="h-4 w-4" /></button>{preset.status !== "archived" && <button type="button" className="grid h-9 w-9 place-items-center border border-gray-200 text-gray-500 hover:text-red-600" title="Archive" disabled={action === preset.public_id} onClick={() => archivePreset(preset.public_id)}>{action === preset.public_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}</button>}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => <PlanEditor key={`${plan.id}-${plan.updated_at}`} plan={plan} saving={action === plan.id} onSave={savePlan} />)}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
