<script context="module">
  let loggedin;
  export async function preload({ query }, { user }) {
    loggedin = !!user;
  }
</script>

<script>
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Fab, { Label, Icon } from "@smui/fab";

  function addUser() {
    console.log("adding user");
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
    <Fab class="floating-fab" color="primary" on:click={addUser} extended>
      <Label>Add User</Label>
      <Icon class="material-icons">add</Icon>
    </Fab>
  </div>
</div>
