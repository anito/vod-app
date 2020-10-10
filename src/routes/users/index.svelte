<script context="module">
  let loggedin;
  export async function preload({ query }, { user }) {
    loggedin = !!user;
  }
</script>

<script>
  import { GridItem, LayoutGrid } from "@sveltejs/site-kit";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Fab, { Label, Icon } from "@smui/fab";

  function addUser() {
    console.log("adding user");
  }
</script>

<style>
  .grid {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "content";
    height: calc(100vh - var(--nav-h) - var(--footer-section-h));
  }
  .no-user {
    grid-area: content;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<svelte:head>
  <title>Physiotherapy Online | Users</title>
</svelte:head>

<LayoutGrid>
  <GridItem name="content" let:inner vcenter={loggedin} hcenter>
    <div class={inner}>
      <Paper color="primary">
        <Title style="color: var(--text-light)">Select User</Title>
      </Paper>
      <Fab class="floating-fab" color="primary" on:click={addUser} extended>
        <Label>Add User</Label>
        <Icon class="material-icons">add</Icon>
      </Fab>
    </div>
  </GridItem>
</LayoutGrid>
