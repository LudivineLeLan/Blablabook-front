<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/auth.js';
	import { onMount } from 'svelte';

	let errorMessage = '';
	let currentUser = null;
	let showModal = false;

	onMount(async () => {
		const token = localStorage.getItem('token');
		if (!token) {
			goto('/login');
			return;
		}
		try {
			const res = await fetch('http://localhost:3000/auth/me', {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!res.ok) throw new Error('Impossible de récupérer les informations utilisateur');
			currentUser = await res.json();
		} catch (err) {
			console.error(err);
			errorMessage = err.message || 'Une erreur est survenue.';
		}
	});

	async function editProfile(event) {
		event.preventDefault();
		errorMessage = '';
		const token = localStorage.getItem('token');
		const form = event.target;
		const formData = new FormData();

		if (form.name.value) formData.append('name', form.name.value);
		if (form.firstname.value) formData.append('firstname', form.firstname.value);
		if (form.age.value) formData.append('age', form.age.value);
		if (form.email.value) formData.append('email', form.email.value);

		const password = form.password.value;
		const confirm = form.confirm.value;
		if (password || confirm) {
			if (password !== confirm) {
				errorMessage = 'Merci de confirmer le mot de passe';
				return;
			}
			formData.append('password', password);
		}

		if (form.avatar.files.length > 0) {
			formData.append('avatar', form.avatar.files[0]);
		}

		try {
			const res = await fetch(`http://localhost:3000/user/${currentUser.id}`, {
				method: 'PATCH',
				headers: { Authorization: `Bearer ${token}` },
				body: formData
			});

			const data = await res.json();
			if (res.ok) {
				localStorage.setItem('token', data.token);
				user.set(data.user);
				goto('/mon-compte');
			} else {
				errorMessage = data.error || 'Erreur lors de la modification des données';
			}
		} catch (err) {
			console.error(err);
			errorMessage = err.message || 'Une erreur est survenue.';
		}
	}

	async function deleteAccount() {
	try {
		const token = localStorage.getItem('token');
		const response = await fetch(`http://localhost:3000/user/${currentUser.id}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${token}` }
		});

		const data = await response.json();

		if (response.ok) {
			user.set(null);
			localStorage.removeItem('token');
			goto('/');
		} else {
			errorMessage = data.error || 'Impossible de supprimer le compte.';
		}
	} catch (error) {
		console.error(error);
		errorMessage = error.message || 'Une erreur est survenue.';
	}
}

</script>

{#if currentUser}
	<form onsubmit={editProfile} enctype="multipart/form-data">
		<h1>Editer mon profil</h1>
		<label for="name">Nom :</label>
		<input type="text" name="name" id="name" value={currentUser.name} />

		<label for="firstname">Prénom :</label>
		<input type="text" name="firstname" id="firstname" value={currentUser.firstname} />

		<label for="age">Âge :</label>
		<input type="number" name="age" id="age" min="0" value={currentUser.age} />

		<label for="emailSignup">Email :</label>
		<input type="email" name="email" id="emailSignup" value={currentUser.email} />

		<label for="passwordSignup">Mot de passe :</label>
		<input type="password" name="password" id="passwordSignup" />

		<label for="confirm">Confirmation du mot de passe :</label>
		<input type="password" name="confirm" id="confirm" />

		<label for="avatar">Avatar :</label>
		<input type="file" name="avatar" id="avatar" accept="image/*" />

		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}

		<div class="buttons-container">
			<button type="submit">Sauvegarder</button>
			<button type="button" onclick={() => goto('/mon-compte')}>Annuler</button>
		</div>
	</form>
{/if}

<button class="delete" aria-label="Supprimer mon compte" onclick={() => (showModal = true)}>
	Supprimer mon compte
</button>
{#if showModal}
	<div class="modal-container">
		<div class="modal">
			<p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
			<div class="modal-buttons">
				<button
					class="confirmDeletion"
					onclick={() => {
						deleteAccount(currentUser);
						showModal = false;
					}}>Oui, supprimer</button
				>
				<button class="cancelDeletion" onclick={() => (showModal = false)}>Annuler</button>
			</div>
		</div>
	</div>
{/if}

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 30%;
		margin: auto;
	}

	label {
		display: flex;
		flex-direction: column;
		font-size: 0.9rem;
	}

	input {
		padding: 0.5rem;
		border-radius: 5px;
		border: 1px solid #ccc;
	}

	.buttons-container {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	button {
		font-size: 1rem;
		padding: 0.5rem 1rem;
	}

	.delete {
		font-size: 1rem;
		padding: 0.5rem 1rem;
		background: unset;
		color: var(--couleur-marron);
		border: none;
		box-shadow: none;
	}

	.modal-container {
		margin: auto;
	}

	.modal-buttons {
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}

	.confirmDeletion,
	.cancelDeletion {
		background: unset;
		color: var(--couleur-marron);
		border: none;
		box-shadow: none;
	}
</style>
