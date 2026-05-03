import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { type: "Apartments", count: 12 },
  { type: "Villas", count: 7 },
  { type: "Family", count: 9 },
  { type: "Beach", count: 4 },
  { type: "City", count: 6 },
  { type: "Luxury", count: 3 },
];

export function PropertyTypeBarChart() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Properties by Type</h2>
      <p className="mt-0.5 text-xs text-gray-400">Listed inventory breakdown</p>
      <div className="mt-5">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="type"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={index === 0 ? "#164b3f" : "#dfe8dd"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
