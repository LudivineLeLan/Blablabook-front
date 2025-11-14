<script>
	import BookForm from '$lib/components/BookForm.svelte';
	export let data;
	let book = data.book;
	let authors = data.authors;
	let genres = data.genres;
</script>

<h1>Modifier le livre : {book.title}</h1>
<BookForm {book} {authors} {genres} />
