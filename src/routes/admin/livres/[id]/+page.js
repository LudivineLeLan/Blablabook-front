import { browser } from '$app/environment';
import { user } from '../../../../lib/stores/auth.js';
import { get } from 'svelte/store';

export async function load({ fetch, params }) {
  if (!browser) return { users: [] };

  const currentUser = get(user);
  const token = currentUser?.token || localStorage.getItem('token');

  if (!token) {
    console.log("Aucun token trouvé");
    return { book: null };
  }

  try {
    const bookResponse = await fetch(`${import.meta.env.VITE_API_URL}/book/${params.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const authorsResponse = await fetch(`${import.meta.env.VITE_API_URL}/authors`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const genresResponse = await fetch(`${import.meta.env.VITE_API_URL}/genres`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!bookResponse.ok || !authorsResponse.ok || !genresResponse.ok) {
      console.log(bookResponse, authorsResponse)
      throw new Error(`Erreur API`);
    }

    const book = await bookResponse.json();
    const authors = await authorsResponse.json();
    const genres = await genresResponse.json();
    console.log(authors)

    return { book, authors, genres };
  } catch (error) {
    console.error(error);
    return { book: null };
  }
}
