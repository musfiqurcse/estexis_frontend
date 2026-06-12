import { useEffect, useState } from "react";
import { Eye, FileText, Building2, TrendingUp, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { StatsCard } from "../../components/admin/widgets/StatsCard";
import { RevenueLineChart } from "../../components/admin/widgets/RevenueLineChart";
import { PropertyTypeBarChart } from "../../components/admin/widgets/PropertyTypeBarChart";
import { StatusPieChart } from "../../components/admin/widgets/StatusPieChart";
import { InquiriesTable } from "../../components/admin/widgets/InquiriesTable";
import { NotificationsPanel } from "../../components/admin/widgets/NotificationsPanel";
import { QuickAddForm } from "../../components/admin/widgets/QuickAddForm";
import { listAdminBlogPosts } from "../../lib/adminApi";
import { useTranslation } from "../../i18n";

const statsCards = [
  { label: "Page Views", value: "12,480", change: 8.2, icon: Eye },
  { label: "Active Inquiries", value: "34", change: 3.1, icon: FileText },
  { label: "Listed Properties", value: "4", change: 0, icon: Building2 },
  { label: "Est. Revenue", value: 990000, change: 12.4, icon: TrendingUp, currency: true },
];

export function AdminDashboardPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const { formatCurrency } = useTranslation();

  useEffect(() => {
    listAdminBlogPosts().then(setBlogPosts).catch(() => {});
  }, []);

  return (
    <AdminLayout title="Overview">
      <div className="space-y-6">
        {/* Row 1: Stats cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statsCards.map((card) => (
            <StatsCard key={card.label} {...card} value={card.currency ? formatCurrency(card.value) : card.value} />
          ))}
        </div>

        {/* Row 2: Line chart + Pie chart */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueLineChart />
          </div>
          <StatusPieChart />
        </div>

        {/* Row 3: Bar chart + Notifications */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PropertyTypeBarChart />
          </div>
          <NotificationsPanel />
        </div>

        {/* Row 4: Inquiries table + Quick add form */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <InquiriesTable />
          </div>
          <QuickAddForm />
        </div>

        {/* Row 5: Blog content list */}
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-900">Blog Content</h2>
            <Link to="/private/admin/blog" className="btn-secondary flex items-center gap-1.5 py-1.5 px-3 text-xs">
              <PlusCircle className="h-3.5 w-3.5" />
              Manage Posts
            </Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {blogPosts.map((post) => (
              <li
                key={post.id}
                className="flex items-center gap-4 p-4 transition hover:bg-gray-50/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {post.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{post.published_at ? new Date(post.published_at).toLocaleDateString() : "Draft"}</p>
                </div>
                <span
                  className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    post.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : post.status === "rejected"
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {post.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
