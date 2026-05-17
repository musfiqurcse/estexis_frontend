import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAdminSession,
  getStoredAdminSession,
  loginAdmin,
  logoutAdmin,
  setUnauthorizedHandler,
  storeAdminSession,
} from "../../lib/adminApi";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(getStoredAdminSession);
  const isAuthenticated = Boolean(session.accessToken);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAdminSession();
      setSession({ accessToken: null, refreshToken: null, user: null });
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  async function login(email, password) {
    try {
      const response = await loginAdmin(email, password);
      if (response?.user?.role !== "admin") {
        clearAdminSession();
        return { success: false, error: "This account does not have admin access." };
      }

      storeAdminSession(response);
      setSession({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        user: response.user,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Unable to sign in." };
    }
  }

  function logout() {
    const refreshToken = getStoredAdminSession().refreshToken;
    clearAdminSession();
    setSession({ accessToken: null, refreshToken: null, user: null });
    logoutAdmin(refreshToken).catch(() => {});
  }

  const value = useMemo(() => ({ isAuthenticated, user: session.user, login, logout }), [isAuthenticated, session.user]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
