import { useState } from "react";

const initialNotifications = [
  {
    id: 1,
    type: "inquiry",
    message: "New inquiry for Sunlit Villa",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "system",
    message: "Property listing updated",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 3,
    type: "inquiry",
    message: "INQ-2049 marked as active",
    time: "3 hr ago",
    read: true,
  },
  {
    id: 4,
    type: "system",
    message: "Admin login from new device",
    time: "Yesterday",
    read: true,
  },
];

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(initialNotifications);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 p-5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#164b3f] text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-gray-400 transition hover:text-gray-700"
          >
            Mark all read
          </button>
        )}
      </div>
      <ul className="flex-1 divide-y divide-gray-50 overflow-y-auto">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`flex gap-3 p-4 transition ${!n.read ? "bg-[#dfe8dd]/20" : ""}`}
          >
            <div
              className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                !n.read ? "bg-[#164b3f]" : "bg-gray-200"
              }`}
            />
            <div>
              <p className="text-sm leading-snug text-gray-800">{n.message}</p>
              <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
