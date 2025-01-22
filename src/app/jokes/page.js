'use client';

import { useState, useEffect } from 'react';
import JokesPageClient from './JokesPageClient';

export default function JokesPage() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    const fetchJokes = async () => {
         try {
           const response = await fetch("https://jokes-pi.vercel.app/api/alljokes", {
             cache: "no-store",
           });
           console.log("API Response:", response);
           if (!response.ok) {
             throw new Error(`HTTP Error: ${response.status}`);
           }
           const data = await response.json();
           console.log("Jokes Data:", data);
           setJokes(Array.isArray(data.jokes) ? data.jokes : []);
         } catch (err) {
           console.error(err);
           setError(err.message || "Something went wrong");
         } finally {
           setLoading(false);
         }
       };
       
   

    fetchJokes();
  }, []);

  return <JokesPageClient jokes={jokes} />;
}
