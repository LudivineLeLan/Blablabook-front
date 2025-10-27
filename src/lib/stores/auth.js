// On importe 'writable' de Svelte : permet de créer une variable réactive partagée entre les composants
import { writable } from 'svelte/store';

// 'browser' est une variable spéciale de SvelteKit
// Elle indique si le code s'exécute dans le navigateur (true) ou côté serveur (false)
// → évite les erreurs d’accès à localStorage côté serveur
import { browser } from '$app/environment';


// Création d’un store Svelte pour l’utilisateur
// 'user' contient les infos de l’utilisateur connecté (ou 'null' s’il n’y a pas de connexion), tous les composants peuvent y accéder avec '$user'
export const user = writable(null);


export async function loadUserFromToken() {
  if (!browser) return; //si on n'est pas dans un navigateur, il ne se passe rien 

  const token = localStorage.getItem('token');

  if (!token) {
    console.log('Token introuvable, utilisateur non connecté');
    user.set(null); // store user à null 
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const userData = await res.json();
      user.set(userData);
    } else { //si token invalide ou expiré, déconnexion auto
      user.set(null);
      localStorage.removeItem('token');
    }
  } catch { //si erreur réseau ou problème serveur
    user.set(null);
    localStorage.removeItem('token');
  }
}


export function logout() {
  user.set(null);
  localStorage.removeItem('token');

  // Vider aussi le store des booklists, si on est dans un navigateur 
  if (browser) {
    import('./booklistStore.js').then(({ clearBooklistStatus }) => {
      clearBooklistStatus();
    });
  }

  console.log('Déconnexion - Stores réinitialisés');


  if (browser && window.location.pathname !== '/') {
    window.location.href = '/';
  }
}