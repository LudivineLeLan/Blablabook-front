<script>
	export let data;
	let books = data.books;
</script>

<h1>Liste des livres</h1>

<ul>
	{#each books as book}
		<li>
			<p><strong>{book.title}</strong></p>
			{#if book.authors?.length}
				{#each book.authors as author}
					<p>{author.firstname} {author.name}</p>
				{/each}
			{:else}
				<p>Auteur inconnu</p>
			{/if}
      <a href={`/admin/livres/${book.id}`}>
			<img src={book.cover} alt={`Couverture de ${book.title}`} width="150" />
      </a>
		</li>
	{/each}
</ul>

<a href="/admin"><button>Retour</button></a>
