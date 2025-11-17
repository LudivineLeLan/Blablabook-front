import { browser } from '$app/environment';
import { user } from '../../../lib/stores/auth.js';
import { get } from 'svelte/store';

export async function load({ fetch }) {
  if (!browser) return { authors: [], genres: [] };

  const currentUser = get(user);
  const token = currentUser?.token || localStorage.getItem('token');

  if (!token) {
    return { authors: [], genres: [] };
  }

  let authors = [];
  let genres = [];

  try {
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

    if (!authorsResponse.ok || !genresResponse.ok) {
      throw new Error('Erreur API');
    }

    authors = await authorsResponse.json();
    genres = await genresResponse.json();
  } catch (error) {
    console.error(error);
  }

  return { authors, genres };
}
