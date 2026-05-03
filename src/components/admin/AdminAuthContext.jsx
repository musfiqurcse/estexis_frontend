import { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext(null);

const STORAGE_KEY = "admin_auth_token";
const VALID_TOKEN = "grihoo_admin_session_v1";
const ADMIN_USER = "admin";
const ADMIN_PASS = "grihoo@admin";

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEY) === VALID_TOKEN
  );

  function login(username, password) {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem(STORAGE_KEY, VALID_TOKEN);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: "Invalid username or password." };
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
