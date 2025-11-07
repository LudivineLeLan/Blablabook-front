<script>
	export let data;
	let book = data.book;
	let coverFile = null;

	async function submitForm(event) {
		event.preventDefault();

		const formData = new FormData();
		formData.append('title', book.title);
		formData.append('synopsis', book.synopsis);
		if (coverFile) {
			formData.append('cover', coverFile);
		}
		formData.append('authors', JSON.stringify(book.authors));

		const token = localStorage.getItem('token');

		try {
			const response = await fetch(`http://localhost:3000/admin/books/${book.id}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});

			if (response.ok) {
				alert('Le livre a été mis à jour avec succès !');
			} else {
				alert('Erreur lors de la mise à jour du livre.');
			}
		} catch (error) {
			console.error(error);
			alert('Une erreur est survenue.');
		}
	}

	function handleCoverChange(event) {
		coverFile = event.target.files[0];
	}
</script>

{#if book}
	<h1>Modifier le livre : {book.title}</h1>
	<form onsubmit={submitForm}>
		<label>
			Titre :
			<input type="text" bind:value={book.title} required />
		</label>

		<label>
			Synopsis :
			<textarea bind:value={book.synopsis}></textarea>
		</label>

		<label>
			Couverture actuelle :
			<img src={book.cover} alt={`Couverture ${book.title}`} width="150" />
		</label>

		<label>
			Changer la couverture :
			<input type="file" accept="image/*" onchange={handleCoverChange} />
		</label>

		<h3>Auteurs :</h3>
		{#each book.authors as author, index}
			<div>
				<input type="text" bind:value={author.firstname} placeholder="Prénom" required />
				<input type="text" bind:value={author.name} placeholder="Nom" required />
				<textarea bind:value={author.bio} placeholder="Biographie"></textarea>
			</div>
		{/each}

		<div class="choice-buttons">
			<button type="submit">Enregistrer les modifications</button>
			<a href="/admin/livres"><button>Retour</button></a>
		</div>
	</form>
{:else}
	<p>Livre introuvable.</p>
{/if}

<style>
	.choice-buttons {
		display: flex;
		flex-direction: row;
	}
</style>
