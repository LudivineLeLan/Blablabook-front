<script>
	import { goto } from '$app/navigation';
</script>

<div class="admin-buttons">
  <button class="admin-btn" onclick={() => goto('/admin/livres')}>Livres</button>
  <button class="admin-btn" onclick={() => goto('/admin/utilisateurs')}>Utilisateurs</button>
</div>

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

</style>