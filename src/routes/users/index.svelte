<script>
  import { goto } from "@sapper/app";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Fab, { Label, Icon } from "@smui/fab";

  function addUser() {
    goto("users/add");
  }
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
      <Title style="color: var(--text-light)">Select User</Title>
    </Paper>
  </div>
  <Fab class="floating-fab" color="primary" on:click={addUser} extended>
    <Label>Add User</Label>
    <Icon class="material-icons">add</Icon>
  </Fab>
</div>
