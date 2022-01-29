<script>
  import { onMount } from 'svelte';
  import { goto } from '@sapper/app';
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import { users } from 'stores/userStore';
  import { _ } from 'svelte-i18n';

  let preSelectedIndex = 0;

  onMount(() => {
    if (!$users.length) return;

    let max = $users.length - 1;
    preSelectedIndex = preSelectedIndex < 0 || preSelectedIndex > max ? 0 : preSelectedIndex;

    goto(`users/${$users[preSelectedIndex].id}`);
  });
</script>

<svelte:head>
  <title>Physiotherapy Online | Users</title>
</svelte:head>

<div class="no-user">
  <div class="content">
    <Paper color="secondary">
      <Title style="color: var(--text-light)">{$_('text.loading-users')}</Title>
    </Paper>
  </div>
</div>

<style>
  .no-user {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
</style>
