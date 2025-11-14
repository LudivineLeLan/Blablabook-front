<script>
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	export let data;
	let users = [];
	let showModal = null;
	let editingUserId = null;
	let selectedRole = '';
	let errorMessage = '';

	onMount(() => {
		users = [...data.users];
	});

	async function deleteUserAccount(id) {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, {
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

	async function updateUserRole(id) {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ role: selectedRole })
			});

			const data = await response.json();

			if (response.ok) {
				users = users.map((user) => (user.id === id ? { ...user, role: selectedRole } : user));
				editingUserId = null;
			} else {
				errorMessage = data.error || 'Erreur lors de la mise à jour du rôle.';
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
					<span>{user.name} {user.firstname} - {user.email}</span>

					{#if editingUserId === user.id}
						<select bind:value={selectedRole}>
							<option value="user">user</option>
							<option value="admin">admin</option>
						</select>
						<button onclick={() => updateUserRole(user.id)}>✔️</button>
						<button onclick={() => (editingUserId = null)}>❌</button>
					{:else}
						<span>rôle : {user.role}</span>
						<div class="icons">
							<Icon
								icon="material-symbols:edit-outline"
								width="20"
								height="20"
								class="edit-button"
								onclick={() => {
									editingUserId = user.id;
									selectedRole = user.role;
								}}
							/>
							<Icon
								icon="material-symbols:delete"
								width="20"
								height="20"
								class="delete-button"
								onclick={() => (showModal = user.id)}
							/>
						</div>
					{/if}
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
		gap: 1rem;
		flex-wrap: wrap;
	}

	.icons {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	select {
		padding: 0.3rem;
		border-radius: 6px;
	}
</style>
