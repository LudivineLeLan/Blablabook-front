<script>
  import { Pencil, Trash2, Check, X, ChevronLeft } from 'lucide-svelte';
  import { onMount } from 'svelte';
	import.meta.env.VITE_API_URL

  export let data;
  let users = [];
  let showModal = null;
  let editingUserId = null;
  let selectedRole = '';
  let errorMessage = '';

  onMount(() => {
    users = [...data.users];
  });

  function getInitials(name, firstname) {
    return `${firstname?.[0] ?? ''}${name?.[0] ?? ''}`.toUpperCase();
  }

  async function deleteUserAccount(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${VITE_API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        users = users.filter((user) => user.id !== id);
        showModal = null;
      } else {
        errorMessage = result.error || 'Impossible de supprimer le compte.';
      }
    } catch (error) {
      errorMessage = 'Une erreur est survenue.';
    }
  }

  async function updateUserRole(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${VITE_API_URL}/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: selectedRole })
      });
      const result = await response.json();
      if (response.ok) {
        users = users.map((user) => (user.id === id ? { ...user, role: selectedRole } : u));
        editingUserId = null;
      } else {
        errorMessage = result.error || 'Erreur lors de la mise à jour du rôle.';
      }
    } catch (error) {
      errorMessage = 'Une erreur est survenue.';
    }
  }
</script>

<div class="page">
  <div class="header">
    <h1>Gestion des utilisateurs</h1>
    <span class="count">{users.length} utilisateurs</span>
  </div>

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

  {#if users.length === 0}
    <p class="empty">Aucun utilisateur trouvé.</p>
  {:else}
    {#each users as user}
      <div class="user-card">
        <div class="avatar" class:admin={user.role === 'admin'}>
          {getInitials(user.name, user.firstname)}
        </div>

        <div class="user-info">
          <span class="user-name">{user.firstname} {user.name}</span>
          <span class="user-email">{user.email}</span>
        </div>

        {#if editingUserId === user.id}
          <select bind:value={selectedRole}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button class="icon-btn confirm" onclick={() => updateUserRole(user.id)}>
            <Check size={14} />
          </button>
          <button class="icon-btn" onclick={() => (editingUserId = null)}>
            <X size={14} />
          </button>
        {:else}
          <span class="badge {user.role}">{user.role}</span>
          <div class="actions">
            <button class="icon-btn" onclick={() => { editingUserId = user.id; selectedRole = user.role; }}>
              <Pencil size={14} />
            </button>
            <button class="icon-btn danger" onclick={() => (showModal = user.id)}>
              <Trash2 size={14} />
            </button>
          </div>
        {/if}
      </div>

      {#if showModal === user.id}
        <div class="modal-overlay">
          <div class="modal">
            <p>Supprimer le compte de <strong>{user.firstname} {user.name}</strong> ?</p>
            <div class="modal-actions">
              <button class="btn-ghost" onclick={() => (showModal = null)}>Annuler</button>
              <button class="btn-danger" onclick={() => deleteUserAccount(user.id)}>Supprimer</button>
            </div>
          </div>
        </div>
      {/if}
    {/each}
  {/if}

  <a href="/admin" class="back-link">
    <ChevronLeft size={14} /> Retour
  </a>
</div>