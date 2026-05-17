import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "../../../i18n";

const data = [
  { month: "Jul", revenue: 164000 },
  { month: "Aug", revenue: 218000 },
  { month: "Sep", revenue: 188000 },
  { month: "Oct", revenue: 420000 },
  { month: "Nov", revenue: 296000 },
  { month: "Dec", revenue: 188000 },
  { month: "Jan", revenue: 340000 },
];

export function RevenueLineChart() {
  const { formatCurrency, formatNumber, convertCurrencyValue } = useTranslation();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Monthly Revenue</h2>
      <p className="mt-0.5 text-xs text-gray-400">Last 7 months</p>
      <div className="mt-5">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${formatNumber(Math.round(convertCurrencyValue(v) / 1000))}k`}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value), "Revenue"]}
              contentStyle={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#164b3f"
              strokeWidth={2}
              dot={{ r: 3, fill: "#164b3f", strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
