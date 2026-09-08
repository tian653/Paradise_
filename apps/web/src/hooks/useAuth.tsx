import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authApi } from "../lib/api";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp is in seconds, Date.now() is in ms
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // treat malformed tokens as expired
  }
}

// ── Context ────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // true until auth state resolved
  const [username, setUsername] = useState<string | null>(null);

  // Restore session on mount — check token validity before trusting localStorage
  useEffect(() => {
    const token = localStorage.getItem("paradise_token");
    const savedUsername = localStorage.getItem("paradise_username");

    if (token && savedUsername && !isTokenExpired(token)) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
    } else if (token) {
      // Token exists but is expired — clear stale data
      localStorage.removeItem("paradise_token");
      localStorage.removeItem("paradise_username");
    }

    setIsLoading(false);
  }, []);

  const login = async (user: string, password: string) => {
    const res = await authApi.login(user, password);
    localStorage.setItem("paradise_token", res.token);
    localStorage.setItem("paradise_username", res.username);
    setIsAuthenticated(true);
    setUsername(res.username);
  };

  const logout = () => {
    localStorage.removeItem("paradise_token");
    localStorage.removeItem("paradise_username");
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
