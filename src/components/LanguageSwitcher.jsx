import { Languages } from "lucide-react";
import { useTranslation } from "../i18n";

export function LanguageSwitcher() {
  const { language, labels, setLanguage } = useTranslation();

  return (
    <label className="flex items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm font-medium">
      <Languages className="h-4 w-4 text-forest" aria-hidden="true" />
      <select
        className="bg-transparent outline-none"
        value={language}
        aria-label="Language"
        onChange={(event) => setLanguage(event.target.value)}
      >
        {Object.entries(labels).map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
