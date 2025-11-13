<script>
	import BookForm from '$lib/components/BookForm.svelte';
	export let data;
	let authors = data.authors;
</script>

<h1>Ajouter un nouveau livre</h1>
<BookForm {authors} />
