<script>
	import BookForm from '$lib/components/BookForm.svelte';

	let book = {
		title: '',
		synopsis: '',
		authors: []
	};
</script>

<h1>Ajouter un nouveau livre</h1>
<BookForm {book} mode="create" />
