import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/Auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
    try {
      const data = await getMe();
      setUser(data?.data ?? data);
    } catch  {
      setUser(null);
    } finally {
      setLoading(false);
    }
};

useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (token) checkAuth();
  else setLoading(false);
}, []);     

    return (
        <AuthContext.Provider value={{ user, setUser, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);