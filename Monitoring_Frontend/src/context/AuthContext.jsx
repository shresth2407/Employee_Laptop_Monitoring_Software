import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, logoutUser } from "../services/authService";
import { tokenStorage, userStorage } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Direct storage se initial state uthao
  const [user, setUser] = useState(() => userStorage.getUser());
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser({ email, password });

      if (!res?.success || !res?.data) {
        throw new Error(res?.message || "Login failed");
      }

      const { accessToken, refreshToken, user: userData } = res.data;

      // 🔥 FIX: Yahan Admin check hata diya taaki Manager/Employee login kar sakein
      tokenStorage.setTokens({ accessToken, refreshToken });
      userStorage.setUser(userData);
      
      // State ko turant update karo taaki bina refresh ke sidebar ko pata chale
      setUser(userData);

      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      tokenStorage.clearTokens();
      userStorage.clearUser();
      setUser(null);
    }
  };

  // Sync state with storage on mount
  useEffect(() => {
    const storedUser = userStorage.getUser();
    if (storedUser && !user) {
      setUser(storedUser);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};