"use client";

import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Create Context
export const AuthContext = createContext();

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("auth_token");

    if (token) {
      try {
        // Decode JWT token to get user ID
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUser({ userId: decodedToken.userId });
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Logout function
  const logout = () => {
    Cookies.remove("auth_token"); // Remove token from cookies
    setUser(null); // Clear user state
    router.push("/login"); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
