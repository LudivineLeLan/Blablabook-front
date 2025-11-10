<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/auth.js';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let currentUser = null;
	let accessDenied = false;

	onMount(() => {
		currentUser = get(user);

		if (!currentUser || currentUser.role !== 'admin') {
			accessDenied = true;
		}
	});
</script>

{#if accessDenied}
	<div class="access-denied">
		<h1>Accès interdit</h1>
		<p>Vous devez être connecté en tant qu'administrateur pour accéder à cette page.</p>
		<button onclick={() => goto('/')}>Retour à l'accueil</button>
	</div>
{:else}
	<div class="admin-buttons">
		<button class="admin-btn" onclick={() => goto('/admin/livres')}>Livres</button>
		<button class="admin-btn" onclick={() => goto('/admin/utilisateurs')}>Utilisateurs</button>
	</div>
{/if}

<style>
	.admin-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		padding: 3rem 1rem;
		flex-wrap: wrap;
	}

	.admin-btn {
		width: 200px;
		height: 200px;
		font-size: 1.5rem;
		font-weight: bold;
		border-radius: 20px;
		border: 2px solid var(--couleur-marron);
		background-color: var(--couleur-beige-clair);
		color: var(--couleur-marron);
		cursor: pointer;
		transition: all 0.2s;
	}

	.admin-btn:hover {
		transform: translateY(-5px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	}

	.access-denied {
		text-align: center;
		margin-top: 5rem;
	}
</style>
