<script>
	import BookForm from '$lib/components/BookForm.svelte';
	export let data;
	let authors = data.authors;
  let genres = data.genres;
</script>

<h1>Ajouter un nouveau livre</h1>
<BookForm {authors} {genres} />
