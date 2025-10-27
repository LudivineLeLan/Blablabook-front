// diffère le déclenchement d'une fonction, ici pour recherche, on veut attendre les premiers caractères avant de chercher
export function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
