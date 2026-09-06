import {
  BarChart3,
  Check,
  ExternalLink,
  FolderOpen,
  LogIn,
  Plus,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InvestorResults } from "../components/investor/InvestorResults";
import { ScenarioEditor, fieldGroups } from "../components/investor/ScenarioEditor";
import { useBuyerAuth } from "../context/BuyerAuthContext";
import { useTranslation } from "../i18n";
import {
  compareSavedScenarios,
  createScenarioVersion,
  getSavedScenario,
  listInvestmentPresets,
  listSavedScenarios,
  previewScenario,
  saveScenario,
  shareSavedScenario,
} from "../lib/investorApi";

const allFieldKeys = fieldGroups.flatMap((group) => group.fields);

function emptyValues() {
  return Object.fromEntries(allFieldKeys.map((key) => [key, ""]));
}

function cleanComparables(items, currencyCode) {
  return items
    .filter((item) => item.label.trim() && item.amount !== "")
    .map((item) => ({
      kind: item.kind,
      label: item.label.trim(),
      amount: item.amount,
      currency_code: currencyCode,
      ...(item.source_url?.trim() ? { source_url: item.source_url.trim() } : {}),
    }));
}

function SavedScenarios({ items, loading, selected, onToggle, onOpen, comparisonMode }) {
  const { t, formatNumber } = useTranslation();
  if (loading) return <p className="py-12 text-center text-sm text-ink/55">{t("investor.saved.loading")}</p>;
  if (!items.length) return <p className="py-12 text-center text-sm text-ink/55">{t("investor.saved.empty")}</p>;

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const isSelected = selected.includes(item.public_id);
        return (
          <article key={item.public_id} className={`border bg-white p-4 ${isSelected ? "border-forest" : "border-ink/10"}`}>
            <div className="flex min-h-14 items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{item.name}</h3>
                <p className="mt-1 text-xs text-ink/45">{item.currency_code} · v{item.version_count}</p>
              </div>
              {comparisonMode && (
                <button
                  type="button"
                  className={`grid h-9 w-9 flex-none place-items-center border ${isSelected ? "border-forest bg-forest text-white" : "border-ink/15 text-ink/50"}`}
                  aria-label={t("investor.compare.select")}
                  onClick={() => onToggle(item.public_id)}
                >
                  {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-y border-ink/10 py-3 text-xs">
              <div>
                <span className="block text-ink/45">{t("investor.metrics.gross_rental_yield_pct")}</span>
                <strong className="mt-1 block text-sm">
                  {item.gross_rental_yield_pct === null ? "--" : `${formatNumber(Number(item.gross_rental_yield_pct), { maximumFractionDigits: 2 })}%`}
                </strong>
              </div>
              <div>
                <span className="block text-ink/45">{t("investor.metrics.cash_on_cash_return_pct")}</span>
                <strong className="mt-1 block text-sm">
                  {item.cash_on_cash_return_pct === null ? "--" : `${formatNumber(Number(item.cash_on_cash_return_pct), { maximumFractionDigits: 2 })}%`}
                </strong>
              </div>
            </div>
            {!comparisonMode && (
              <button type="button" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-forest" onClick={() => onOpen(item.public_id)}>
                <FolderOpen className="h-4 w-4" aria-hidden="true" />
                {t("investor.saved.open")}
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}

function ComparisonTable({ comparison }) {
  const { t, formatCurrency, formatNumber } = useTranslation();
  if (!comparison) return null;
  const rows = [
    ["total_acquisition_cost", "money"],
    ["gross_rental_yield_pct", "pct"],
    ["net_operating_yield_pct", "pct"],
    ["cash_on_cash_return_pct", "pct"],
    ["dscr", "ratio"],
    ["pre_tax_cash_flow_monthly", "money"],
  ];
  return (
    <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
      <table className="w-full min-w-[44rem] text-sm">
        <thead className="bg-mist">
          <tr>
            <th className="px-4 py-3 text-left">{t("investor.compare.metric")}</th>
            {comparison.items.map((item) => <th key={item.scenario_public_id} className="px-4 py-3 text-right">{item.scenario_name}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/10">
          {rows.map(([key, type]) => (
            <tr key={key}>
              <th className="px-4 py-3 text-left font-medium text-ink/65">{t(`investor.metrics.${key}`)}</th>
              {comparison.items.map((item) => {
                const value = item.metrics[key];
                let formatted = "--";
                if (value !== null) {
                  if (type === "money") formatted = formatCurrency(Number(value), item.currency_code, { maximumFractionDigits: 2 });
                  else if (type === "pct") formatted = `${formatNumber(Number(value), { maximumFractionDigits: 2 })}%`;
                  else formatted = formatNumber(Number(value), { maximumFractionDigits: 2 });
                }
                return <td key={item.scenario_public_id} className="px-4 py-3 text-right font-semibold tabular-nums">{formatted}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {comparison.note && <p className="border-t border-ink/10 px-4 py-3 text-xs text-ink/55">{comparison.note}</p>}
    </div>
  );
}

export function InvestorWorkspacePage() {
  const { t } = useTranslation();
  const { isAuthenticated, isReady } = useBuyerAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCurrency = (searchParams.get("currency") || "BDT").toUpperCase();
  const listingId = searchParams.get("listing");
  const linkedListingFromQuery = listingId
    ? {
        publicId: listingId,
        title: searchParams.get("title"),
        price: searchParams.get("price"),
      }
    : null;
  const [tab, setTab] = useState("model");
  const [name, setName] = useState("");
  const [currencyCode, setCurrencyCode] = useState(initialCurrency);
  const [values, setValues] = useState(emptyValues);
  const [comparables, setComparables] = useState([]);
  const [presets, setPresets] = useState([]);
  const [selectedPresetIds, setSelectedPresetIds] = useState([]);
  const [linkedListing, setLinkedListing] = useState(linkedListingFromQuery);
  const [result, setResult] = useState(null);
  const [editingScenario, setEditingScenario] = useState(null);
  const [saved, setSaved] = useState([]);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedLoading, setSavedLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    let active = true;
    listInvestmentPresets({ currency: currencyCode })
      .then((items) => {
        if (active) setPresets(items);
      })
      .catch(() => {
        if (active) setPresets([]);
      });
    return () => {
      active = false;
    };
  }, [currencyCode]);

  useEffect(() => {
    if ((tab !== "saved" && tab !== "compare") || !isAuthenticated) return;
    setSavedLoading(true);
    listSavedScenarios()
      .then((data) => setSaved(data.items || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setSavedLoading(false));
  }, [tab, isAuthenticated]);

  const payload = useMemo(() => {
    const inputs = Object.entries(values)
      .filter(([fieldKey, value]) => value !== "" && !(linkedListing && fieldKey === "acquisition_price"))
      .map(([field_key, value]) => ({ field_key, value }));
    return {
      ...(name.trim() ? { name: name.trim() } : {}),
      ...(linkedListing?.publicId ? { listing_public_id: linkedListing.publicId } : {}),
      currency_code: currencyCode,
      inputs,
      preset_public_ids: selectedPresetIds,
      comparables: cleanComparables(comparables, currencyCode),
    };
  }, [values, name, linkedListing, currencyCode, selectedPresetIds, comparables]);

  function setValue(fieldKey, value) {
    setValues((current) => ({ ...current, [fieldKey]: value }));
  }

  function togglePreset(preset) {
    setSelectedPresetIds((current) => {
      const withoutSameField = current.filter((id) => {
        const item = presets.find((candidate) => candidate.public_id === id);
        return item?.field_key !== preset.field_key;
      });
      if (current.includes(preset.public_id)) return withoutSameField;
      setValue(preset.field_key, "");
      return [...withoutSameField, preset.public_id];
    });
  }

  function resetWorkspace() {
    setName("");
    setValues(emptyValues());
    setComparables([]);
    setSelectedPresetIds([]);
    setLinkedListing(linkedListingFromQuery);
    setResult(null);
    setEditingScenario(null);
    setShareUrl("");
    setNotice("");
    setError("");
    setTab("model");
  }

  async function calculate(event) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const next = await previewScenario(payload);
      setResult(next);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!isAuthenticated) {
      navigate("/login", { state: { returnTo: `${window.location.pathname}${window.location.search}` } });
      return;
    }
    setSaving(true);
    setError("");
    try {
      let detail;
      if (editingScenario) {
        detail = await createScenarioVersion(editingScenario.public_id, {
          ...payload,
          based_on_version: editingScenario.version_count,
        });
      } else {
        detail = await saveScenario(payload);
      }
      setEditingScenario(detail);
      setResult(detail.current_version);
      setNotice(t(editingScenario ? "investor.notices.versionSaved" : "investor.notices.saved"));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function openScenario(publicId) {
    setSavedLoading(true);
    setError("");
    try {
      const detail = await getSavedScenario(publicId);
      const nextValues = emptyValues();
      detail.current_version.inputs.forEach((input) => {
        nextValues[input.field_key] = String(input.value);
      });
      setName(detail.name);
      setCurrencyCode(detail.currency_code);
      setValues(nextValues);
      setSelectedPresetIds([]);
      setComparables(detail.current_version.comparables.map((item) => ({ ...item, amount: String(item.amount), source_url: item.source_url || "" })));
      setLinkedListing(
        detail.current_version.listing_snapshot
          ? {
              publicId: detail.current_version.listing_snapshot.public_id,
              title: detail.current_version.listing_snapshot.title,
              price: detail.current_version.listing_snapshot.price_amount,
            }
          : null,
      );
      setEditingScenario(detail);
      setResult(detail.current_version);
      setTab("model");
      setShareUrl("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavedLoading(false);
    }
  }

  function toggleComparison(publicId) {
    setSelectedForComparison((current) => {
      if (current.includes(publicId)) return current.filter((id) => id !== publicId);
      if (current.length >= 3) return current;
      return [...current, publicId];
    });
  }

  async function runComparison() {
    if (selectedForComparison.length < 2) return;
    setLoading(true);
    setError("");
    try {
      const data = await compareSavedScenarios(
        selectedForComparison.map((scenario_public_id) => ({ scenario_public_id })),
      );
      setComparison(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function share() {
    if (!editingScenario) return;
    setError("");
    try {
      const data = await shareSavedScenario(editingScenario.public_id);
      const url = `${window.location.origin}/investor/shared/${data.token}`;
      setShareUrl(url);
      await navigator.clipboard?.writeText(url);
      setNotice(t("investor.notices.linkCopied"));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const authPrompt = !isReady || isAuthenticated ? null : (
    <div className="border border-ink/10 bg-white px-5 py-8 text-center">
      <LogIn className="mx-auto h-6 w-6 text-forest" aria-hidden="true" />
      <p className="mt-3 text-sm font-semibold">{t("investor.saved.signInTitle")}</p>
      <button type="button" className="btn-primary mt-4" onClick={() => navigate("/login", { state: { returnTo: "/investor" } })}>
        {t("nav.login")}
      </button>
    </div>
  );

  return (
    <div className="pb-12">
      <header className="border-b border-ink/10 bg-white">
        <div className="page-shell flex flex-wrap items-end justify-between gap-4 py-7">
          <div>
            <h1 className="text-2xl font-semibold text-ink md:text-3xl">{t("investor.title")}</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-ink/60">{t("investor.subtitle")}</p>
          </div>
          <div className="flex gap-2">
            {editingScenario && (
              <button type="button" className="btn-secondary" onClick={share}>
                <Share2 className="h-4 w-4" aria-hidden="true" />
                {t("investor.actions.share")}
              </button>
            )}
            <button type="button" className="btn-secondary" onClick={resetWorkspace}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("investor.actions.new")}
            </button>
          </div>
        </div>
      </header>

      <div className="page-shell pt-5">
        <div className="inline-flex max-w-full overflow-x-auto border border-ink/10 bg-white p-1" role="tablist">
          {[
            ["model", BarChart3],
            ["saved", FolderOpen],
            ["compare", BarChart3],
          ].map(([key, Icon]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={`inline-flex h-10 min-w-28 items-center justify-center gap-2 px-4 text-sm font-semibold ${tab === key ? "bg-forest text-white" : "text-ink/60 hover:text-forest"}`}
              onClick={() => setTab(key)}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {t(`investor.tabs.${key}`)}
            </button>
          ))}
        </div>

        {(error || notice || shareUrl) && (
          <div className={`mt-4 border-l-4 px-4 py-3 text-sm ${error ? "border-[#a23f2d] bg-[#fff4f1] text-[#7f2d20]" : "border-forest bg-sage/60 text-forest"}`} role="status">
            {error || notice}
            {shareUrl && (
              <a href={shareUrl} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 break-all font-semibold underline">
                <ExternalLink className="h-4 w-4 flex-none" aria-hidden="true" />
                {shareUrl}
              </a>
            )}
          </div>
        )}

        {tab === "model" && (
          <div className="mt-5 grid items-start gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(34rem,1.1fr)]">
            <div className="border border-ink/10 bg-white p-4 sm:p-5">
              <ScenarioEditor
                name={name}
                setName={setName}
                currencyCode={currencyCode}
                setCurrencyCode={setCurrencyCode}
                values={values}
                setValue={setValue}
                presets={presets}
                selectedPresetIds={selectedPresetIds}
                togglePreset={togglePreset}
                comparables={comparables}
                setComparables={setComparables}
                linkedListing={linkedListing}
                loading={loading}
                saving={saving}
                onCalculate={calculate}
                onSave={save}
                canSave={Boolean(result)}
                editingScenario={editingScenario}
              />
            </div>
            <InvestorResults result={result} />
          </div>
        )}

        {tab === "saved" && (
          <section className="mt-5">
            {authPrompt || <SavedScenarios items={saved} loading={savedLoading} selected={[]} onOpen={openScenario} onToggle={() => {}} />}
          </section>
        )}

        {tab === "compare" && (
          <section className="mt-5">
            {authPrompt || (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-ink/60">{t("investor.compare.selection").replace("{count}", selectedForComparison.length)}</p>
                  <button type="button" className="btn-primary" disabled={selectedForComparison.length < 2 || loading} onClick={runComparison}>
                    <BarChart3 className="h-4 w-4" aria-hidden="true" />
                    {t("investor.actions.compare")}
                  </button>
                </div>
                <SavedScenarios
                  items={saved}
                  loading={savedLoading}
                  selected={selectedForComparison}
                  onToggle={toggleComparison}
                  onOpen={() => {}}
                  comparisonMode
                />
                <ComparisonTable comparison={comparison} />
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
