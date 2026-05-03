import { Outlet } from "react-router-dom";
import { AdminAuthProvider } from "../components/admin/AdminAuthContext";

export function AdminRouteLayout() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}
