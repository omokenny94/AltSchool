import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/Auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // restore session on refresh
  useEffect(() => {
  const initAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await getMe();
      console.log("AUTH SUCCESS", data);

      setUser(data); // API already returns user object directly
    } catch (err) {
      console.log("AUTH FAILED", err.response?.status);
      setUser(null);
    } finally {
      setLoading(false); // ⭐ CRITICAL LINE
    }
  };

  initAuth();
}, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);