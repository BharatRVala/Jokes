import JokesPageClient from './JokesPageClient';

export default async function JokesPage() {
  let jokes = [];

  try {
<<<<<<< HEAD
    const response = await fetch('/api/alljokes', {
=======
    const response = await fetch('api/alljokes', {
>>>>>>> 0eece9bbc5f2c7e948d1c76de5404f8ef954b80b
      cache: 'no-store',
    });
    const data = await response.json();
    jokes = Array.isArray(data.jokes) ? data.jokes : [];
  } catch (error) {
    console.error('Error fetching jokes:', error);
  }

  return <JokesPageClient jokes={jokes} />;
}
