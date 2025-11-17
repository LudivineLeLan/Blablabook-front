<script>
	import emailjs from '@emailjs/browser';
	let loginEmail = '';
	let message = '';
	let error = '';
	let sending = false;
	let status = '';

	async function handleReset(event) {
		event.preventDefault();
		message = '';
		error = '';
		sending = true;
		status = '';

		if (!loginEmail) {
			error = 'Merci de saisir votre e-mail !';
			sending = 'false';
			return;
		}

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/forgot-password`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: loginEmail })
			});

			const data = await res.json();
			if (!res.ok) {
				error = data.error || 'Erreur serveur';
				sending = 'false';
				return;
			}

			const resetLink = `http://localhost:5173/reinitialisation/${data.token}`;

			await emailjs.send(
				import.meta.env.VITE_EMAILJS_SERVICE_ID,
				import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RESET,
				{ reset_link: resetLink, email: loginEmail },
				import.meta.env.VITE_EMAILJS_PUBLIC_KEY
			);

			message = `Un lien de réinitialisation a été envoyé à ${loginEmail}.`;
			loginEmail = '';
		} catch (error) {
			console.error(error);
			error = 'Erreur lors de l’envoi du mail.';
		} finally {
			sending = false; 
		}
	}
</script>

<h1>Mot de passe oublié</h1>

<div class="ask-password">
	<form onsubmit={handleReset}>
		<label>
			E-MAIL :
			<input type="email" bind:value={loginEmail} required />
		</label>
		<button type="submit" disabled={sending}>
			{#if sending}
				Envoi...{:else}Réinitialiser mon mot de passe{/if}
		</button>
	</form>
	{#if status}
		<p>{status}</p>
	{/if}
</div>

<style>
	/* Media queries */
	.ask-password {
		max-width: 90%;
		margin: 2rem auto;
		padding: 1rem;
		text-align: center;
		background-color: var(--couleur-beige-clair);
		border-radius: 30px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	label {
		display: flex;
		flex-direction: column;
		text-align: left;
	}

	input {
		padding: 0.6rem;
		border-radius: 20px;
		border: 1px solid var(--couleur-marron);
	}

	@media (min-width: 768px) and (max-width: 1024px) {
		.ask-password {
			max-width: 600px;
			padding: 2rem;
		}

		form {
			gap: 1rem;
		}

		input {
			padding: 0.75rem;
			font-size: 1rem;
		}
	}

	@media (min-width: 1025px) {
		.ask-password {
			max-width: 700px;
			padding: 2.5rem;
		}

		form {
			gap: 1rem;
		}

		input {
			padding: 0.8rem;
			font-size: 1rem;
		}
	}
</style>
