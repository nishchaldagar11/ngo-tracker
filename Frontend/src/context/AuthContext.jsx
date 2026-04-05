import { createContext } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // 🔥 MOST IMPORTANT FIX
      localStorage.setItem("user", JSON.stringify({
        token: res.data.token,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role
      }));

      console.log("LOGIN SUCCESS:", res.data);

      return res.data;

    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ login }}>
      {children}
    </AuthContext.Provider>
  );
};