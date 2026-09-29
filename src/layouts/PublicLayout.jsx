import { Outlet } from "react-router-dom";
import { ConstructionBanner } from "../components/ConstructionBanner";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { BuyerAuthProvider } from "../context/BuyerAuthContext";

export function PublicLayout() {
  return (
    <BuyerAuthProvider>
      <div className="min-h-screen bg-linen text-ink">
        <Navbar />
        <ConstructionBanner />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </BuyerAuthProvider>
  );
}
