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
    const res = await fetch(`http://localhost:3000/book/${params.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status}`);
    }

    const book = await res.json();
    return { book };
  } catch (error) {
    console.error(error);
    return { book: null };
  }
}
