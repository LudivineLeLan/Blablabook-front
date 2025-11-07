<script>
	export let data;
	let users = data.users;
</script>

<h1>Liste des utilisateurs</h1>

{#if users.length === 0}
	<p>Aucun utilisateur trouvé.</p>
{:else}
	<ul>
		{#each users as user}
			<li>{user.name} {user.firstname} - {user.email} - rôle: {user.role}</li>
		{/each}
	</ul>
{/if}

<a href="/admin"><button>Retour</button></a>
