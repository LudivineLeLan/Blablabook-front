<script>
	import { user, logout } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';

	let darkMode = false;

	function toggleDarkMode() {
		darkMode = !darkMode;
		document.body.classList.toggle('dark-mode', darkMode);
		localStorage.setItem('darkMode', darkMode);
	}
</script>

<header class="header">
	<div class="header-top">
		<div class="logo-title">
			<a href="/admin"><img src="/LogoBBB.png" alt="Logo BlaBlaBook" class="logo-icon" /></a>
			<p class="title"><a href="/admin">BlaBlaBook</a></p>
		</div>

		<div class="auth-buttons">
			{#if $user}
				<div class="user-actions">
					<button class="connection-btn" onclick={() => goto('/mon-compte')}>Mon compte</button>
					<button class="connection-btn logout-btn" onclick={() => logout()}>Déconnexion</button>
					<button class="dark-mode" onclick={toggleDarkMode}>{darkMode ? '☀️' : '🌙'}</button>
				</div>
			{:else}
				<div class="user-actions">
					<button class="connection-btn" onclick={() => goto('/connexion')}>Connexion</button>
					<button class="dark-mode" onclick={toggleDarkMode}>{darkMode ? '☀️' : '🌙'}</button>
				</div>
			{/if}
		</div>
	</div>
</header>

<main class="admin-main">
	<slot />
</main>

<style>
	header {
		background-color: var(--couleur-beige-rose);
		padding: 0.5rem;
	}

	.header-top {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.logo-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.logo-icon {
		height: 80px;
		width: auto;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	.title {
		font-family: var(--font-bbb);
		color: var(--couleur-marron);
		font-size: 2rem;
		margin: 0;
		text-align: center;
	}

	.auth-buttons {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.user-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}

	.connection-btn,
	.dark-mode {
		font-family: var(--font-global);
		padding: 0.5rem 1rem;
		border-radius: 30px;
		font-weight: bold;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.connection-btn {
		background-color: var(--couleur-bleu-vert);
		border: solid 2px var(--couleur-beige-clair);
		color: var(--couleur-beige-clair);
	}

	.connection-btn:hover,
	.dark-mode:hover {
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	@media (max-width: 728px) {
		.user-actions {
			flex-direction: column;
			gap: 0.3rem;
			align-items: center;
			width: auto;
		}
	}
</style>
