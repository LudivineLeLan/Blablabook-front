<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/auth.js';
	import emailjs from '@emailjs/browser';

	let isLogin = true;
	let errorMessage = '';

	// ----- REGISTER FORM -----
	let name = '';
	let firstname = '';
	let age = '';
	let email = '';
	let password = '';
	let confirm = '';
	let avatar = null;

	// Regex et warnings
	$: nameWarning = name.length > 0 && (name.length < 2 || name.length > 30) 
		? 'Le nom doit contenir entre 2 et 30 caractères' : '';

	$: firstnameWarning = firstname.length > 0 && (firstname.length < 2 || firstname.length > 30) 
		? 'Le prénom doit contenir entre 2 et 30 caractères' : '';

	$: ageWarning = age && (age < 0 || age > 120) 
		? 'L’âge doit être compris entre 0 et 120' : '';

	$: emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|fr)$/i;
	$: emailWarning = email.length > 0 && !emailRegex.test(email) 
		? 'L’email doit être valide' : '';

	$: passwordRegex = /^[\p{L}\p{N}!@#$%^&*()_+\-=[\]{}|;:'",.<>?/]{8,30}$/u;
	$: passwordWarning = password.length > 0 && !passwordRegex.test(password) 
		? 'Le mot de passe doit contenir 8 à 30 caractères et peut inclure lettres, chiffres et symboles !@#$%^&*()_+-=[]{}|;:\'",.<>?/' 
		: '';

	$: confirmWarning = confirm.length > 0 && confirm !== password
		? 'Les mots de passe ne correspondent pas' : '';

	// ----- LOGIN -----
	async function Login(event) {
		event.preventDefault();
		errorMessage = '';

		const formData = new FormData(event.target);

		const res = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: formData.get('email'),
				password: formData.get('password')
			})
		});

		const data = await res.json();

		if (res.ok) {
			localStorage.setItem('token', data.token);
			user.set(data.user);
			goto('/mon-compte');
		} else {
			errorMessage = data.error || 'Erreur lors de la connexion';
		}
	}

	// ----- REGISTER -----
	async function Register(event) {
		event.preventDefault();
		errorMessage = '';

		// Vérification frontend avant fetch
		if (nameWarning || firstnameWarning || ageWarning || emailWarning || passwordWarning || confirmWarning) {
			errorMessage = 'Veuillez corriger les erreurs ci-dessus avant de continuer.';
			return;
		}

		const formData = new FormData();
		formData.append('name', name);
		formData.append('firstname', firstname);
		formData.append('age', age);
		formData.append('email', email);
		formData.append('password', password);
		formData.append('avatar', avatar);

		const res = await fetch(`${import.meta.env.VITE_API_URL}/user/register`, {
			method: 'POST',
			body: formData
		});

		const data = await res.json();

		if (res.ok) {
			try {
				await emailjs.send(
					import.meta.env.VITE_EMAILJS_SERVICE_ID,
					import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONFIRM,
					{
						email: email,
						confirm_link: data.confirmLink 
					},
					import.meta.env.VITE_EMAILJS_PUBLIC_KEY
				);

				localStorage.setItem('pending_email', email);
				localStorage.setItem('pending_token', data.token);

				goto('/compte-cree');
			} catch (error) {
				console.error('Erreur lors de l’envoi EmailJS :', error);
				errorMessage = "L'utilisateur a bien été créé, mais l'email n’a pas pu être envoyé.";
			}
		} else {
			errorMessage = data.error || 'Erreur lors de la création de compte';
		}
	}
</script>

<div class="auth-container">
	<!-- Onglets -->
	<div class="tabs" role="tablist" aria-label="Choix du mode d’authentification">
		<button
			role="tab"
			class:active={isLogin}
			aria-selected={isLogin}
			aria-controls="panel-login"
			on:click={() => isLogin = true}
		>Connexion</button>

		<button
			role="tab"
			class:active={!isLogin}
			aria-selected={!isLogin}
			aria-controls="panel-register"
			on:click={() => isLogin = false}
		>Création de compte</button>
	</div>

	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}

	<!-- LOGIN PANEL -->
	<div id="panel-login" role="tabpanel" aria-labelledby="tab-login" tabindex={isLogin ? 0 : -1} hidden={!isLogin}>
		<form on:submit={Login}>
			<label>Email :
				<input type="email" name="email" required />
			</label>
			<label>Mot de passe :
				<input type="password" name="password" required />
			</label>
			<button type="submit">Se connecter</button>
		</form>
	</div>

	<!-- REGISTER PANEL -->
	<div id="panel-register" role="tabpanel" aria-labelledby="tab-register" tabindex={!isLogin ? 0 : -1} hidden={isLogin}>
		<form on:submit={Register} enctype="multipart/form-data">
			<label>Nom :
				<input type="text" bind:value={name} required />
				{#if nameWarning}<p class="warning">{nameWarning}</p>{/if}
			</label>

			<label>Prénom :
				<input type="text" bind:value={firstname} required />
				{#if firstnameWarning}<p class="warning">{firstnameWarning}</p>{/if}
			</label>

			<label>Âge :
				<input type="number" bind:value={age} min="0" max="120" required />
				{#if ageWarning}<p class="warning">{ageWarning}</p>{/if}
			</label>

			<label>Email :
				<input type="email" bind:value={email} required />
				{#if emailWarning}<p class="warning">{emailWarning}</p>{/if}
			</label>

			<label>Mot de passe :
				<input type="password" bind:value={password} required minlength="8" />
				{#if passwordWarning}<p class="warning">{passwordWarning}</p>{/if}
			</label>

			<label>Confirmation :
				<input type="password" bind:value={confirm} required minlength="8" />
				{#if confirmWarning}<p class="warning">{confirmWarning}</p>{/if}
			</label>

			<label>Avatar :
				<input type="file" accept="image/*" on:change={e => avatar = e.target.files[0]} />
			</label>

			<button type="submit">Créer mon compte</button>
		</form>
	</div>
</div>

<style>
	.auth-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 1rem;
		border-radius: 30px;
	}

	.tabs {
		display: flex;
		border-bottom: 2px solid #ccc;
		margin-bottom: 1rem;
	}

	.tabs button {
		all: unset;
		flex: 1;
		text-align: center;
		padding: 0.5rem;
		cursor: pointer;
		font-weight: bold;
		color: #666;
		box-sizing: border-box;
	}

	.tabs button.active {
		color: var(--couleur-marron);
		border-bottom: 3px solid var(--couleur-marron);
		font-weight: bold;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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

	.warning {
		color: orange;
		font-size: 0.8rem;
		margin-top: 0.2rem;
	}

	.error {
		color: red;
		text-align: center;
		margin-bottom: 1rem;
	}

	@media (max-width: 768px) {
		.auth-container {
			padding: 0.5rem;
		}
	}
</style>