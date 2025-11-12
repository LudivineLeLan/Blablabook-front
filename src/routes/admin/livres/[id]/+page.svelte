<script>
	import BookForm from '$lib/components/BookForm.svelte';
	export let data;
	let book = data.book;
</script>

<h1>Modifier le livre : {book.title}</h1>
<BookForm {book} mode="edit" />
