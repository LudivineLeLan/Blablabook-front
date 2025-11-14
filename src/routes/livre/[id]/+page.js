export async function load({ params }) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/book/${params.id}`);
  const book = await res.json();

  console.log(book);

  return { book };
}   