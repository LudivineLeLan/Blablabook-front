<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let message = 'Confirmation en cours...';

  onMount(async () => {
    const token = $page.url.searchParams.get('token'); 
    if (!token) {
      message = "Lien invalide.";
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/confirm/${token}`);
      const data = await res.json();
      message = res.ok ? 'Votre compte est validé!' : data.error;
    } catch (error) {
      message = 'Erreur lors de la confirmation.';
    }
  });

  function goToLogin() {
    goto('/connexion');
  }
</script>

<h1>{message}</h1>
{#if message === 'Votre compte est validé!'}
  <button onclick={goToLogin}>Se connecter</button>
{/if}


<style>
  button {
    max-width: 70%;
    margin: auto;
  }
</style>