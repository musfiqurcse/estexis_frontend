import { Menu } from "lucide-react";

export function AdminTopbar({ title, onMenuToggle }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <p className="hidden text-sm text-gray-400 sm:block">{today}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#164b3f] text-xs font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}
