'use client';

import { useState, useEffect } from 'react';
import JokesPageClient from './JokesPageClient';

export default function JokesPage() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const response = await fetch('https://jokes-pi.vercel.app/api/alljokes', {
          cache: 'no-store',
        });
        const data = await response.json();
        setJokes(Array.isArray(data.jokes) ? data.jokes : []);
      } catch (error) {
        console.error('Error fetching jokes:', error);
      }
    };

    fetchJokes();
  }, []);

  return <JokesPageClient jokes={jokes} />;
}
