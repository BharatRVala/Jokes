"use client";

import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("auth_token");
    console.log("Token from cookie:", token);

    if (token) {
      try {
        // Decode the token payload
        const decodedToken = jwt.decode(token);
        console.log("Decoded Token:", decodedToken);

        if (decodedToken && decodedToken.userId) {
          setUser({ userId: decodedToken.userId });
        } else {
          console.error("Invalid token payload:", decodedToken);
          setUser(null);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null);
      }
    } else {
      console.warn("No auth token found");
      setUser(null);
    }
  }, []);

  const logout = () => {
    Cookies.remove("auth_token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
