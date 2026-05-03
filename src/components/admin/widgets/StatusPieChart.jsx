import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Active", value: 34 },
  { name: "Under Review", value: 18 },
  { name: "Closed", value: 12 },
];

const COLORS = ["#164b3f", "#b88a44", "#dfe8dd"];

export function StatusPieChart() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Inquiry Status</h2>
      <p className="mt-0.5 text-xs text-gray-400">Current distribution</p>
      <div className="mt-5">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: 12, color: "#6b7280" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
