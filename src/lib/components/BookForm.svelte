<script>
	import { goto } from '$app/navigation';

	export let book = null;
	export const mode = book === null ? 'create' : 'edit';
	export let authors = [];
	export let genres = [];

	let coverFile = null;
	let errorMessage = '';
	let successMessage = '';

	// Initialisation pour éviter que {#each} plante
	let formBook = book || {
		title: '',
		synopsis: '',
		genres: [],
		authors: [],
		cover: ''
	};

	$: if (book) {
		formBook = {
			id: book.id,
			title: book.title,
			synopsis: book.synopsis,
			cover: book.cover,
			genres: book.genres.map((genre) => genre.id),
			authors: book.authors.map((auteur) => auteur.id)
		};
	}

	async function submitForm(event) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';

		const formData = new FormData();
		formData.append('title', formBook.title);
		formData.append('synopsis', formBook.synopsis);
		formData.append('genre', formBook.genres);
		if (coverFile) formData.append('cover', coverFile);
		formData.append('authors', JSON.stringify(formBook.authors));

		const token = localStorage.getItem('token');
		const url =
			mode === 'edit'
				? `http://localhost:3000/admin/books/${formBook.id}`
				: `http://localhost:3000/admin/books`;
		const method = mode === 'edit' ? 'PUT' : 'POST';

		try {
			const response = await fetch(url, {
				method,
				headers: { Authorization: `Bearer ${token}` },
				body: formData
			});
			const data = await response.json();

			if (response.ok) {
				successMessage =
					mode === 'edit'
						? 'Le livre a été mis à jour avec succès !'
						: 'Le livre a été créé avec succès !';

				if (mode === 'create') goto(`/admin/livres/${data.book.id}`);
			} else {
				errorMessage = data.message || 'Erreur lors de l’envoi du formulaire.';
			}
		} catch (err) {
			console.error(err);
			errorMessage = 'Une erreur est survenue.';
		}
	}

	function handleCoverChange(event) {
		coverFile = event.target.files[0];
	}

	async function deleteBook(id) {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`http://localhost:3000/admin/books/${id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${token}` }
			});

			const data = await response.json();

			if (response.ok) {
				goto('/admin/livres');
			} else {
				errorMessage = data.error || 'Impossible de supprimer le livre.';
			}
		} catch (error) {
			console.error(error);
			errorMessage = error.message || 'Une erreur est survenue.';
		}
	}
</script>

<form onsubmit={submitForm}>
	<div class="book-edition">
		<label>
			Titre :
			<input type="text" bind:value={formBook.title} required />
		</label>

		<label>
			Synopsis :
			<textarea bind:value={formBook.synopsis}></textarea>
		</label>

		<label>Genre(s) :</label>

		<select id="genres" name="genre" multiple bind:value={formBook.genres}>
			{#each genres as genre}
				<option value={genre.id}> {genre.name} </option>
			{/each}
		</select>

		{#if mode === 'edit' && formBook.cover}
			<div class="cover-preview">
				<p>Couverture actuelle :</p>
				<img src={formBook.cover} alt={`Couverture ${formBook.title}`} width="150" />
			</div>
		{/if}

		<label for="coverFile">Changer la couverture :</label>
		<input id="coverFile" type="file" accept="image/*" onchange={handleCoverChange} />

		<label>Auteur(s) :</label>

		<select id="authors" name="auteur" multiple bind:value={formBook.authors}>
			{#each authors as author}
				<option value={author.id}> {author.firstname} {author.name} </option>
			{/each}
		</select>
	</div>

	<div class="choice-buttons">
		<button type="submit">
			{mode === 'edit' ? 'Enregistrer les modifications' : 'Ajouter le livre'}
		</button>
		{#if mode === 'edit'}
			<button type="button" class="delete-button" onclick={() => deleteBook(book.id)}>
				Supprimer le livre
			</button>
		{/if}
		<a href="/admin/livres"><button type="button">Retour</button></a>
	</div>

	{#if successMessage}
		<p class="success">{successMessage}</p>
	{/if}
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
</form>

<style>
	.book-edition {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.book-edition label {
		display: flex;
		flex-direction: column;
		font-weight: bold;
		font-size: 0.9rem;
		width: 100%;
	}

	.book-edition input,
	.book-edition textarea {
		width: 100%;
		box-sizing: border-box;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	.author-fields {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.choice-buttons {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;
	}

	.success {
		color: green;
		margin-top: 1rem;
		text-align: center;
	}

	.error {
		color: red;
		margin-top: 1rem;
		text-align: center;
	}
</style>
