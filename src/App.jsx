import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminRouteLayout } from "./layouts/AdminRouteLayout";
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";
import { AdminLoginPage } from "./pages/admin/LoginPage";
import { AdminDashboardPage } from "./pages/admin/DashboardPage";
import { AdminBlogPage } from "./pages/admin/BlogPage";
import { BlogListPage } from "./pages/BlogListPage";
import { BlogDetailPage } from "./pages/BlogDetailPage";
import { BookingPage } from "./pages/BookingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LegalPage } from "./pages/LegalPage";
import { PropertyDetailsPage } from "./pages/PropertyDetailsPage";
import { PropertiesPage } from "./pages/PropertiesPage";

export default function App() {
  return (
    <Routes>
      {/* Public routes — Navbar + ConstructionBanner + Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailsPage />} />
        <Route path="/inquiry/:id" element={<BookingPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/terms-and-conditions" element={<LegalPage type="terms" />} />
        <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
        <Route path="/imprint" element={<LegalPage type="imprint" />} />
        <Route path="/impressum" element={<LegalPage type="impressum" />} />
      </Route>

      {/* Admin routes — no public chrome, auth scoped here */}
      <Route path="/private/admin" element={<AdminRouteLayout />}>
        <Route path="login" element={<AdminLoginPage />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="blog" element={<AdminBlogPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
