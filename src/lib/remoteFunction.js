export const getSearchSuggestions = async (query, type, signal) => {
  if (!query) return [];

  const url = new URL('http://localhost:3000/search'); //on créer l'URL de la recherche
  url.searchParams.set('q', query);
  if (type) url.searchParams.set('type', type); // si auteur ou genre recherché, filtrer la recherche

  const res = await fetch(url, { signal }); // on passe signal pour pouvoir annuler la requête si une nouvelle recherche est effectuée

  if (!res.ok) throw new Error('Recherche échouée');

  const data = await res.json();
  return data;
};
