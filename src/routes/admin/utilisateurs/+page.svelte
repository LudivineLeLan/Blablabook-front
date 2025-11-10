<script>
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';

	export let data;
	let users = data.users;
	let showModal = null;
	let errorMessage = '';

	async function deleteUserAccount(id) {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`http://localhost:3000/admin/users/${id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${token}` }
			});

			const data = await response.json();

			if (response.ok) {
				users = users.filter((user) => user.id !== id);
				showModal = null;
			} else {
				errorMessage = data.error || 'Impossible de supprimer le compte.';
			}
		} catch (error) {
			console.error(error);
			errorMessage = error.message || 'Une erreur est survenue.';
		}
	}
</script>

<h1>Liste des utilisateurs</h1>

{#if users.length === 0}
	<p>Aucun utilisateur trouvé.</p>
{:else}
	<ul>
		{#each users as user}
			<li>
				<div class="user-line">
					<span>{user.name} {user.firstname} - {user.email} - rôle: {user.role}</span>
					<div class="icons">
						<Icon icon="material-symbols:edit-outline" width="20" height="20" class="edit-button" />
						<Icon
							icon="material-symbols:delete"
							width="20"
							height="20"
							class="delete-button"
							onclick={() => (showModal = user.id)}
						/>
					</div>
				</div>

				{#if showModal === user.id}
					<div class="modal-container">
						<div class="modal">
							<p>Êtes-vous sûr de vouloir supprimer ce compte ?</p>
							<div class="modal-buttons">
								<button class="confirmDeletion" onclick={() => deleteUserAccount(user.id)}
									>Oui, supprimer</button
								>
								<button class="cancelDeletion" onclick={() => (showModal = null)}>Annuler</button>
							</div>
						</div>
					</div>
				{/if}
			</li>
		{/each}
	</ul>
{/if}

<a href="/admin"><button>Retour</button></a>

<style>
	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		margin: 1rem 0;
		max-width: 70%;
	}

	.user-line {
		display: flex;
		align-items: center;
	}

	.icons {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.modal-buttons {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
</style>
