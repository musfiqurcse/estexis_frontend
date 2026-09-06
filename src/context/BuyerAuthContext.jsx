import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearInvestorAccessToken,
  loginInvestor,
  logoutInvestor,
  refreshInvestorSession,
  setInvestorUnauthorizedHandler,
} from "../lib/investorApi";

const BuyerAuthContext = createContext(null);

export function BuyerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    setInvestorUnauthorizedHandler(() => {
      if (active) setUser(null);
    });
    refreshInvestorSession()
      .then((session) => {
        if (!active) return;
        if (session?.user?.role === "buyer") setUser(session.user);
      })
      .catch(() => {
        clearInvestorAccessToken();
      })
      .finally(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
      setInvestorUnauthorizedHandler(null);
    };
  }, []);

  async function login(email, password) {
    try {
      const session = await loginInvestor(email, password);
      if (session?.user?.role !== "buyer") {
        await logoutInvestor();
        return { ok: false, error: "buyer_required" };
      }
      setUser(session.user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message || "login_failed" };
    }
  }

  async function logout() {
    setUser(null);
    await logoutInvestor().catch(() => {});
  }

  const value = useMemo(
    () => ({ user, isReady, isAuthenticated: Boolean(user), login, logout }),
    [user, isReady],
  );

  return <BuyerAuthContext.Provider value={value}>{children}</BuyerAuthContext.Provider>;
}

export function useBuyerAuth() {
  const context = useContext(BuyerAuthContext);
  if (!context) throw new Error("useBuyerAuth must be used within BuyerAuthProvider");
  return context;
}
