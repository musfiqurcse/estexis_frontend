import { Route, Routes } from "react-router-dom";
import { ConstructionBanner } from "./components/ConstructionBanner";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { BookingPage } from "./pages/BookingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LegalPage } from "./pages/LegalPage";
import { PropertyDetailsPage } from "./pages/PropertyDetailsPage";
import { PropertiesPage } from "./pages/PropertiesPage";

export default function App() {
  return (
    <div className="min-h-screen bg-linen text-ink">
      <Navbar />
      <ConstructionBanner />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/inquiry/:id" element={<BookingPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/terms-and-conditions" element={<LegalPage type="terms" />} />
          <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
          <Route path="/imprint" element={<LegalPage type="imprint" />} />
          <Route path="/impressum" element={<LegalPage type="impressum" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
