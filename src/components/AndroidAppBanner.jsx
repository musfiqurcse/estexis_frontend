import { X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../i18n";

export function AndroidAppBanner() {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-sage text-ink px-4 py-3 sm:px-6">
            <div className="page-shell flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.6915026,0.192399101 C17.7273533,0.165427495 17.7721419,0.165427495 17.8080542,0.192399101 L22.4032365,13.5078901 C22.4600707,13.6693859 22.3922722,13.8507339 22.2454235,13.9344545 L3.1011071,25.2699995 C2.89106281,25.3856932 2.61865268,25.2771253 2.50295292,25.0670701 C2.40413792,24.8924007 2.44880453,24.6772309 2.60132578,24.5524434 L21.7456444,0.541435915 C21.8925244,0.417722059 22.1080631,0.464067896 22.2348944,0.611266766 Z" />
                    </svg>
                    <p className="text-sm font-medium">
                        {t("banner.androidComingSoon") || "🤖 grihoo Android app coming soon. Get notified when it launches."}
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 text-ink/70 hover:text-ink transition"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
