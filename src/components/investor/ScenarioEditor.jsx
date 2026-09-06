import { Building2, Calculator, ExternalLink, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useTranslation } from "../../i18n";

export const fieldGroups = [
  {
    key: "purchase",
    fields: ["acquisition_price", "closing_costs", "renovation_costs"],
  },
  {
    key: "operations",
    fields: [
      "expected_monthly_rent",
      "vacancy_rate_pct",
      "property_tax_annual",
      "insurance_annual",
      "hoa_service_charge_annual",
      "maintenance_reserve_annual",
      "management_fee_pct",
      "other_expense_annual",
    ],
  },
  {
    key: "financing",
    fields: ["down_payment_amount", "loan_amount", "interest_rate_pct", "amortization_years"],
  },
];

const percentageFields = new Set(["vacancy_rate_pct", "management_fee_pct", "interest_rate_pct"]);

function NumericField({ fieldKey, value, onChange, preset, disabled }) {
  const { t, formatNumber } = useTranslation();
  const isPercentage = percentageFields.has(fieldKey);
  const isYears = fieldKey === "amortization_years";
  const suffix = isPercentage ? "%" : isYears ? t("investor.form.years") : null;

  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-semibold text-ink/65">
        {t(`investor.fields.${fieldKey}`)}
      </span>
      <span className="relative block">
        <input
          className="input-field h-11 pr-12 tabular-nums disabled:cursor-not-allowed disabled:bg-mist disabled:text-ink/55"
          type="number"
          inputMode="decimal"
          min={isYears ? 1 : 0}
          max={isPercentage ? 100 : isYears ? 50 : undefined}
          step={isYears ? 1 : "any"}
          value={preset ? preset.value : value}
          disabled={disabled || Boolean(preset)}
          placeholder={t("investor.form.optional")}
          onChange={(event) => onChange(fieldKey, event.target.value)}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-ink/40">
            {suffix}
          </span>
        )}
      </span>
      {preset && (
        <span className="mt-1 block truncate text-xs text-[#76541f]">
          {preset.name}: {formatNumber(Number(preset.value), { maximumFractionDigits: 2 })}
        </span>
      )}
    </label>
  );
}

function ComparableEditor({ comparables, currencyCode, onChange }) {
  const { t } = useTranslation();

  function update(index, key, value) {
    onChange(comparables.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  }

  function add() {
    onChange([
      ...comparables,
      { kind: "rent", label: "", amount: "", currency_code: currencyCode, source_url: "" },
    ]);
  }

  function remove(index) {
    onChange(comparables.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <section className="border-t border-ink/10 pt-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{t("investor.comparables.title")}</h3>
          <p className="mt-0.5 text-xs text-ink/50">{t("investor.comparables.subtitle")}</p>
        </div>
        <button type="button" className="btn-secondary h-9 px-3 py-2" onClick={add}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t("investor.comparables.add")}
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {comparables.map((item, index) => (
          <div key={index} className="grid gap-2 border border-ink/10 bg-mist/50 p-3 sm:grid-cols-[7rem_1fr_8rem_2.5rem]">
            <select
              className="input-field h-10"
              value={item.kind}
              aria-label={t("investor.comparables.kind")}
              onChange={(event) => update(index, "kind", event.target.value)}
            >
              <option value="rent">{t("investor.comparables.rent")}</option>
              <option value="sale">{t("investor.comparables.sale")}</option>
              <option value="listing">{t("investor.comparables.listing")}</option>
            </select>
            <input
              className="input-field h-10"
              value={item.label}
              maxLength={200}
              placeholder={t("investor.comparables.label")}
              onChange={(event) => update(index, "label", event.target.value)}
            />
            <input
              className="input-field h-10 tabular-nums"
              type="number"
              min="0"
              step="any"
              value={item.amount}
              placeholder={currencyCode}
              onChange={(event) => update(index, "amount", event.target.value)}
            />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center border border-ink/10 bg-white text-ink/55 hover:text-[#a23f2d]"
              title={t("investor.comparables.remove")}
              aria-label={t("investor.comparables.remove")}
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <label className="sm:col-span-4">
              <span className="sr-only">{t("investor.comparables.sourceUrl")}</span>
              <span className="relative block">
                <ExternalLink className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink/35" aria-hidden="true" />
                <input
                  className="input-field h-10 pl-9"
                  type="url"
                  value={item.source_url}
                  placeholder={t("investor.comparables.sourceUrl")}
                  onChange={(event) => update(index, "source_url", event.target.value)}
                />
              </span>
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ScenarioEditor({
  name,
  setName,
  currencyCode,
  setCurrencyCode,
  values,
  setValue,
  presets,
  selectedPresetIds,
  togglePreset,
  comparables,
  setComparables,
  linkedListing,
  loading,
  saving,
  onCalculate,
  onSave,
  canSave,
  editingScenario,
}) {
  const { t, formatDate, formatNumber } = useTranslation();
  const selectedPresets = presets.filter((preset) => selectedPresetIds.includes(preset.public_id));
  const selectedByField = Object.fromEntries(selectedPresets.map((preset) => [preset.field_key, preset]));

  return (
    <form className="space-y-6" onSubmit={onCalculate}>
      <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
        <label>
          <span className="mb-1.5 block text-xs font-semibold text-ink/65">{t("investor.form.name")}</span>
          <input
            className="input-field h-11"
            value={name}
            maxLength={200}
            placeholder={t("investor.form.namePlaceholder")}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold text-ink/65">{t("investor.form.currency")}</span>
          <select
            className="input-field h-11"
            value={currencyCode}
            disabled={Boolean(linkedListing) || Boolean(editingScenario)}
            onChange={(event) => setCurrencyCode(event.target.value)}
          >
            <option value="BDT">BDT</option>
            <option value="EUR">EUR</option>
            <option value="AED">AED</option>
            <option value="USD">USD</option>
          </select>
        </label>
      </div>

      {linkedListing && (
        <div className="flex items-center gap-3 border-l-4 border-forest bg-sage/60 px-4 py-3">
          <Building2 className="h-5 w-5 flex-none text-forest" aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{linkedListing.title || t("investor.form.linkedListing")}</p>
            <p className="text-xs text-ink/55">
              {linkedListing.publicId} · {linkedListing.price ? formatNumber(Number(linkedListing.price)) : currencyCode}
            </p>
          </div>
        </div>
      )}

      {presets.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold">{t("investor.presets.title")}</h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {presets.map((preset) => {
              const checked = selectedPresetIds.includes(preset.public_id);
              return (
                <label
                  key={preset.public_id}
                  className={`flex cursor-pointer gap-3 border p-3 transition ${checked ? "border-gold bg-[#fff9ef]" : "border-ink/10 bg-white hover:border-ink/25"}`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[#164b3f]"
                    checked={checked}
                    onChange={() => togglePreset(preset)}
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{preset.name}</span>
                    <span className="mt-0.5 block text-xs text-ink/55">
                      {t(`investor.fields.${preset.field_key}`)} · {formatNumber(Number(preset.value), { maximumFractionDigits: 2 })}
                    </span>
                    <a
                      href={preset.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate text-xs font-medium text-forest underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {preset.source_title} · {formatDate(preset.reviewed_at)}
                    </a>
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {fieldGroups.map((group) => (
        <fieldset key={group.key} className="border-t border-ink/10 pt-5">
          <legend className="px-0 text-sm font-semibold">{t(`investor.groups.${group.key}`)}</legend>
          <div className="mt-3 grid gap-x-3 gap-y-4 sm:grid-cols-2">
            {group.fields.map((fieldKey) => (
              <NumericField
                key={fieldKey}
                fieldKey={fieldKey}
                value={values[fieldKey] || ""}
                preset={selectedByField[fieldKey]}
                disabled={linkedListing && fieldKey === "acquisition_price"}
                onChange={setValue}
              />
            ))}
          </div>
        </fieldset>
      ))}

      <ComparableEditor
        comparables={comparables}
        currencyCode={currencyCode}
        onChange={setComparables}
      />

      <div className="sticky bottom-3 z-10 flex flex-wrap gap-2 border border-ink/10 bg-white/95 p-3 shadow-lg backdrop-blur">
        <button type="submit" className="btn-primary min-w-40 flex-1" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Calculator className="h-4 w-4" aria-hidden="true" />}
          {t("investor.actions.calculate")}
        </button>
        <button
          type="button"
          className="btn-secondary min-w-36 flex-1"
          disabled={!canSave || saving}
          onClick={onSave}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {editingScenario ? t("investor.actions.newVersion") : t("investor.actions.save")}
        </button>
      </div>
    </form>
  );
}
