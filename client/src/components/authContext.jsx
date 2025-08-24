import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (authToken) => {
    if (!authToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setUser(response.data);
      setToken(authToken);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setLoading(false);
    } else if (storedToken) {
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
