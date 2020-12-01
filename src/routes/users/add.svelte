<script context="module">
  import * as api from "api.js";

  export async function preload_({ params, query }, { user }) {
    const res = await api.get(`users/${params.slug}`, user && user.token);

    if (res && res.success) {
      const { id, name } = { ...res.data };
      return { id, name, ...query };
    } else {
      this.error(
        (res.data && res.data.code) || res.status,
        res.message || res.responseText
      );
    }
  }
</script>

<script>
  import { onMount } from "svelte";
  import { UserManager } from "components";

  const TABS = ["time", "user"];

  export let tab = "time";

  let selectionUserId = "add";
  let root;

  $: tab = ((t) => TABS.find((itm) => itm === t) || TABS[0])(tab);

  onMount(() => {
    root = document.documentElement;
    root.classList.add("add-user-view--open");
    return () => root.classList.remove("add-user-view--open");
  });
</script>

<style>
  .grid {
    display: grid;
    grid-template-areas: "one";
    grid-gap: var(--grid-gap);
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    height: calc(100% - var(--breadcrumb-h));
  }
</style>

<svelte:head>
  <title>Physiotherapy Online | Add User</title>
</svelte:head>

<div class="grid">
  <UserManager selectedMode="add" />
</div>
