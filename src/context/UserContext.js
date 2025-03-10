'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
        const token = Cookies.get('auth_token');
      
        if (!token) {
          console.error("No auth token found!");
          return;
        }
      
        try {
          const res = await fetch('/api/user', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
      
          const data = await res.json();
      
          if (res.ok) {
            console.log("User Data Fetched:", data.user); // Debugging
            setUser(data.user); // Store full user data
          } else {
            console.error('Error fetching user:', data.message);
          }
        } catch (error) {
          console.error('User fetch error:', error);
        }
      };
      

    fetchUserDetails();
  }, []);

  const logout = () => {
    Cookies.remove('auth_token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
