<script>
  import { Header, Table } from "components";
  import { sitename } from "stores";
</script>

<svelte:head>
  <title>{$sitename} | About</title>
</svelte:head>

<Header h="4" mdc class="m-2 lg:m-5">About this site</Header>
<div class="grid">
  <div class="cols-3">
    <Table />
  </div>
</div>
