<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import { users } from "../../stores/userStore";

  let preSelectedIndex = 0;

  onMount(() => {
    if (!$users.length) return;

    let max = $users.length - 1;
    preSelectedIndex =
      preSelectedIndex < 0 || preSelectedIndex > max ? 0 : preSelectedIndex;

    goto(`users/${$users[preSelectedIndex].id}`);
  });
</script>

<style>
  .no-user {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
</style>

<svelte:head>
  <title>Physiotherapy Online | Users</title>
</svelte:head>

<div class="no-user">
  <div class="content">
    <Paper color="primary">
      <Title style="color: var(--text-light)">Lade Benutzer...</Title>
    </Paper>
  </div>
</div>
