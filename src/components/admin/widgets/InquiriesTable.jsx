const inquiries = [
  {
    id: "INQ-2049",
    property: "Garden townhouse near the river",
    buyer: "Maria K.",
    status: "active",
    date: "2026-04-28",
    value: 218000,
  },
  {
    id: "INQ-2050",
    property: "Sunlit villa with pool",
    buyer: "Thomas R.",
    status: "reviewing",
    date: "2026-04-25",
    value: 420000,
  },
  {
    id: "INQ-2051",
    property: "Central design apartment",
    buyer: "Fatima A.",
    status: "closed",
    date: "2026-04-20",
    value: 164000,
  },
  {
    id: "INQ-2052",
    property: "Family retreat by the dunes",
    buyer: "Hans M.",
    status: "active",
    date: "2026-04-18",
    value: 188000,
  },
];

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700",
  reviewing: "bg-amber-50 text-amber-700",
  closed: "bg-gray-100 text-gray-500",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function InquiriesTable() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <div className="border-b border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900">Recent Inquiries</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                ID
              </th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Property
              </th>
              <th className="hidden p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 md:table-cell">
                Buyer
              </th>
              <th className="hidden p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">
                Date
              </th>
              <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Value
              </th>
              <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr
                key={inq.id}
                className="border-b border-gray-50 transition hover:bg-gray-50/50 last:border-0"
              >
                <td className="p-4 font-mono text-xs text-gray-400">{inq.id}</td>
                <td className="max-w-[180px] truncate p-4 font-medium text-gray-900">
                  {inq.property}
                </td>
                <td className="hidden p-4 text-gray-500 md:table-cell">{inq.buyer}</td>
                <td className="hidden p-4 text-gray-400 sm:table-cell">{inq.date}</td>
                <td className="p-4 text-right font-semibold text-gray-900">
                  €{inq.value.toLocaleString()}
                </td>
                <td className="p-4 text-right">
                  <StatusBadge status={inq.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
