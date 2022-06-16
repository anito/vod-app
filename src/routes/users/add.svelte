<script context="module">
  import * as api from "api";

  export async function preload_({ params, query }, { user }) {
    const res = await api.get(`users/${params.slug}`, user?.jwt);

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
  import { sitename } from "stores";
  import { UserManager } from "components";

  export let tab = "time";

  const TABS = ["time", "user"];

  let root;

  $: tab = ((t) => TABS.find((itm) => itm === t) || TABS[0])(tab);

  onMount(() => {
    root = document.documentElement;
    root.classList.add("add-user-view--open");
    return () => root.classList.remove("add-user-view--open");
  });
</script>

<svelte:head>
  <title>{$sitename} | Klient hinzufügen</title>
</svelte:head>

<div class="grid flex-1">
  <UserManager selectedMode="add" />
</div>

<style>
  .grid {
    display: grid;
    grid-template-areas: "one";
    grid-gap: var(--grid-gap);
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }
</style>
