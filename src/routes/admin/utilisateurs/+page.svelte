<script>
	import { Pencil, Trash2, Check, X } from 'lucide-svelte';
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

{#if errorMessage}
	<p class="error">{errorMessage}</p>
{/if}

{#if users.length === 0}
	<p>Aucun utilisateur trouvé.</p>
{:else}
	<ul>
		{#each users as user}
			<li>
				<div class="user-line">
					<div class="avatar">{user.firstname[0]}{user.name[0]}</div>
					<span class="user-info">{user.firstname} {user.name} — {user.email}</span>

					{#if editingUserId === user.id}
						<select bind:value={selectedRole}>
							<option value="user">user</option>
							<option value="admin">admin</option>
						</select>
						<button class="icon-btn confirm" onclick={() => updateUserRole(user.id)}>
							<Check size={16} />
						</button>
						<button class="icon-btn" onclick={() => (editingUserId = null)}>
							<X size={16} />
						</button>
					{:else}
						<span class="badge {user.role}">{user.role}</span>
						<div class="icons">
							<button class="icon-btn" onclick={() => { editingUserId = user.id; selectedRole = user.role; }}>
								<Pencil size={16} />
							</button>
							<button class="icon-btn danger" onclick={() => (showModal = user.id)}>
								<Trash2 size={16} />
							</button>
						</div>
					{/if}
				</div>

				{#if showModal === user.id}
					<div class="modal-container">
						<div class="modal">
							<p>Êtes-vous sûr de vouloir supprimer ce compte ?</p>
							<div class="modal-buttons">
								<button class="confirmDeletion" onclick={() => deleteUserAccount(user.id)}>
									Oui, supprimer
								</button>
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
		margin: 0.75rem 0;
	}

	.user-line {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: nowrap;
	}

	.avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #e6f1fb;
		color: #185fa5;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: 500;
		flex-shrink: 0;
		text-transform: uppercase;
	}

	.user-info {
		flex: 1;
		font-size: 14px;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.badge {
		font-size: 11px;
		font-weight: 500;
		padding: 3px 8px;
		border-radius: 99px;
		flex-shrink: 0;
	}

	.badge.admin {
		background: #faeeda;
		color: #ba7517;
	}

	.badge.user {
		background: #f0f0f0;
		color: #666;
	}

	.icons {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.icon-btn {
		width: 30px;
		height: 30px;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666;
		padding: 0;
	}

	.icon-btn:hover {
		background: #f5f5f5;
		color: #333;
	}

	.icon-btn.confirm {
		color: green;
		border-color: green;
	}

	.icon-btn.danger:hover {
		background: #fcebeb;
		color: #a32d2d;
		border-color: #f09595;
	}

	select {
		padding: 0.3rem;
		border-radius: 6px;
		font-size: 13px;
	}

	.modal-container {
		margin-top: 0.5rem;
		padding: 1rem;
		background: #f9f9f9;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
		max-width: 360px;
	}

	.modal p {
		font-size: 14px;
		margin-bottom: 0.75rem;
	}

	.modal-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.confirmDeletion {
		padding: 6px 14px;
		border-radius: 6px;
		border: none;
		background: #fcebeb;
		color: #a32d2d;
		font-weight: 500;
		cursor: pointer;
	}

	.cancelDeletion {
		padding: 6px 14px;
		border-radius: 6px;
		border: 1px solid #e0e0e0;
		background: transparent;
		color: #666;
		cursor: pointer;
	}

	.error {
		color: #a32d2d;
		font-size: 13px;
		margin-bottom: 1rem;
	}
</style>