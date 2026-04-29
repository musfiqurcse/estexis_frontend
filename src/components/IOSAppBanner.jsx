import { X, Apple } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../i18n";

export function IOSAppBanner() {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-forest text-white px-4 py-3 sm:px-6">
            <div className="page-shell flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Apple className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">
                        {t("banner.iosComingSoon") || "📱 grihoo iOS app coming soon. Get notified when it launches."}
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 text-white/70 hover:text-white transition"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
