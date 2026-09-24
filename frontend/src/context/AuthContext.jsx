import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadUser = async () => {

      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const response = await api.get("/auth/me");

        setUser(response.data);

      } catch (error) {

        localStorage.removeItem("token");
        setToken(null);
        setUser(null);

      } finally {

        setLoading(false);
      }
    };

    loadUser();

  }, [token]);

  const login = async (email, password) => {

    const response = await api.post(
      `/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );

    const jwt = response.data;

    localStorage.setItem("token", jwt);
    setToken(jwt);

    const userResponse = await api.get("/auth/me");

    setUser(userResponse.data);

    return userResponse.data;
  };

  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);