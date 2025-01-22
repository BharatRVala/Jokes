import JokesPageClient from './JokesPageClient';

export default async function JokesPage() {
  let jokes = [];

  try {
    const response = await fetch('/api/alljokes', {
      cache: 'no-store',
    });
    const data = await response.json();
    jokes = Array.isArray(data.jokes) ? data.jokes : [];
  } catch (error) {
    console.error('Error fetching jokes:', error);
  }

  return <JokesPageClient jokes={jokes} />;
}
