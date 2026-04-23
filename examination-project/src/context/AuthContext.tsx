import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useMemo, 
  ReactNode 
} from "react";
import { getMe } from "../api/Auth";

/** * 1. Define the User shape. 
 * Replace this with your actual User interface from your types folder.
 */
export interface User {
  createdAt: string | number | Date;
  name: ReactNode;
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
}

/** * 2. Define the Context interface.
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

/**
 * 3. Initialize with undefined.
 * This allows us to check if the hook is used outside the provider.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Memoize the logout function to prevent unnecessary re-renders
  const logout = useMemo(() => () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMe();
        setUser(data);
      } catch (err: any) {
        // Standard JWT/Auth error handling
        console.error("AUTH_ERROR:", err.response?.status ?? err.message);
        
        if (err.response?.status === 401) {
          localStorage.removeItem("accessToken");
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * 4. Memoize the value object.
   * This prevents all consuming components from re-rendering unless 
   * user or loading actually changes.
   */
  const value = useMemo(
    () => ({ user, setUser, loading, logout }),
    [user, loading, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 5. The "TypeScript Worthy" Hook.
 * By throwing an error here, we guarantee that whenever we use useAuth(), 
 * the returned value is NOT undefined.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};