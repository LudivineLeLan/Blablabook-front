import { browser } from '$app/environment';
import { user } from '../../../lib/stores/auth.js';
import { get } from 'svelte/store';

export async function load({ fetch }) {
  if (!browser) return { users: [] };

  const currentUser = get(user);
  const token = currentUser?.token || localStorage.getItem('token');

  if (!token) {
    console.log("Aucun token trouvé");
    return { book: null };
  }

  try {
    const authorsResponse = await fetch(`http://localhost:3000/authors`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!authorsResponse.ok) {
      throw new Error(`Erreur API`);
    }

    const authors = await authorsResponse.json();

    return { authors };
  } catch (error) {
    console.error(error);
    return { authors : []};
  }
}
