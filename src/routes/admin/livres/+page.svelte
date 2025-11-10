<script>
	export let data;
	let books = data.books;
</script>

<h1>Liste des livres</h1>

<div class="books-list">
	<ul>
		{#each books as book}
			<li>
				<a href={`/admin/livres/${book.id}`}>
					<img src={book.cover} alt={`Couverture de ${book.title}`} />
				</a>
				<div class="book-info">
					<p><strong>{book.title}</strong></p>
					{#if book.authors?.length}
						{#each book.authors as author}
							<p>{author.firstname} {author.name}</p>
						{/each}
					{:else}
						<p>Auteur inconnu</p>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</div>

<a href="/admin"><button>Retour</button></a>

<style>
	.books-list ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1.5rem;
		justify-items: center;
		padding: 0;
		margin: 0 auto;
		max-width: 1200px;
	}

	.books-list li {
		list-style: none;
		text-align: center;
		grid-template-rows: auto 1fr;
		justify-items: center;
		width: 100%;
		max-width: 150px;
	}

	.books-list img {
		border-radius: 8px;
		max-width: 100%;
		height: auto;
		display: block;
		margin: 0 auto 0.5rem;
		align-self: start; /* force l'image à rester en haut de la cellule */
	}

	h1 {
		text-align: center;
		margin-bottom: 2rem;
	}

	a button {
		margin: 2rem auto;
		display: block;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		font-weight: bold;
		cursor: pointer;
	}
</style>
