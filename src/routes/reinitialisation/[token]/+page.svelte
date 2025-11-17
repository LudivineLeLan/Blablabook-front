<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	let token = '';
	let newPassword = '';
	let confirmPassword = '';
	let message = '';
	let error = '';

	onMount(() => {
		const params = get(page).params;
		token = params.token || '';
	});

	async function handleReset(event) {
		event.preventDefault();
		error = '';
		message = '';

		if (!newPassword || !confirmPassword) {
			error = 'Merci de remplir tous les champs.';
			return;
		}

		if (newPassword !== confirmPassword) {
			error = 'Les mots de passe ne correspondent pas.';
			return;
		}

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/reset-password/${token}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: newPassword })
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.error || 'Erreur serveur';
				return;
			}

			message = data.message;
			newPassword = '';
			confirmPassword = '';
		} catch (err) {
			error = 'Erreur réseau. Veuillez réessayer.';
			console.error(err);
		}
	}
</script>

<h1>Réinitialiser votre mot de passe</h1>

<div class="reset-form">
	<form onsubmit={handleReset}>
		<label>
			Nouveau mot de passe :
			<input type="password" bind:value={newPassword} required />
		</label>

		<label>
			Confirmer le mot de passe :
			<input type="password" bind:value={confirmPassword} required />
		</label>

		<button type="submit">Réinitialiser le mot de passe</button>
	</form>

	{#if message}
		<p class="success">{message}</p>
	{/if}

	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style>
	.reset-form {
		max-width: 500px;
		margin: 2rem auto;
		padding: 1.5rem;
		background-color: var(--couleur-beige-clair);
		border-radius: 30px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-align: center;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
	}

	input {
		padding: 0.6rem;
		border-radius: 20px;
		border: 1px solid var(--couleur-marron);
	}

	button {
		padding: 0.8rem 1.6rem;
		border-radius: 30px;
		border: none;
		cursor: pointer;
	}

	.success {
		color: green;
	}

	.error {
		color: red;
	}
</style>
