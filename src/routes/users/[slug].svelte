<script context="module">
  import * as api from "api.js";

  export async function preload({ params, query }, { user }) {
    const res = await api.get(`users/${params.slug}`, user && user.token);

    if (res && res.success) {
      const { id, name } = { ...res.data };
      return { id, name, ...query };
    } else {
      this.error(res.data.code, res.data.message);
    }
  }
</script>

<script>
  import { goto } from "@sapper/app";
  import { UserManager, TimeManager } from "components";
  import Button, { Group, Label, Icon } from "@smui/button";

  const TABS = ["time", "user"];

  // available from preload
  export let id;
  export let name;
  export let tab = "time";

  let selectionUserId;

  $: selectionUserId = id;
  $: tab = ((t) => TABS.find((itm) => itm === t) || TABS[0])(tab);

  async function changeTab(tab) {
    const wait = await goto(`users/${selectionUserId}?tab=${tab}`);
    return false;
  }
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: var(--toolbar-h) auto;
    grid-gap: var(--grid-gap);
    height: calc(100% - var(--breadcrumb-h));
    align-items: center;
  }
  :global(.grid.user) {
    grid-template-areas:
      "toolbar toolbar"
      "one two";
    grid-template-columns: 1fr;
  }
  :global(.grid.video) {
    grid-template-areas:
      "toolbar toolbar"
      "one two";
    grid-template-columns: repeat(2, 1fr);
  }
  :global(.grid.time) {
    grid-template-areas:
      "toolbar toolbar"
      "one two"
      "one two";
    grid-template-columns: 3fr 5fr;
    grid-template-rows: var(--toolbar-h) auto 10rem;
    align-items: initial;
  }
  :global(.loggedin) .grid {
    align-items: initial;
  }
  .grid-item {
    background: var(--back-grid-item);
    padding-left: 0.4rem;
  }
  .toolbar {
    grid-area: toolbar;
    display: flex;
    align-items: center;
    height: var(--toolbar-h);
  }
</style>

<svelte:head>
  <title>Physiotherapy Online | User {name}</title>
</svelte:head>

<div class="grid {tab}">
  <div class="grid-item toolbar">
    <Group variant="unelevated">
      <Button
        class="focus:outline-none focus:shadow-outline"
        on:click={() => changeTab(TABS[0])}
        variant={tab === TABS[0] ? 'unelevated' : ''}>
        <Icon class="material-icons">video_settings</Icon>
        <Label>Videos</Label>
      </Button>
      <Button
        class="focus:outline-none focus:shadow-outline"
        on:click={() => changeTab(TABS[1])}
        variant={tab === TABS[1] ? 'unelevated' : ''}>
        <Icon class="material-icons">account_circle</Icon>
        <Label>User</Label>
      </Button>
    </Group>
  </div>
  {#if tab === TABS[0]}
    <TimeManager {selectionUserId} />
  {/if}
  {#if tab === TABS[1]}
    <UserManager {selectionUserId} />
  {/if}
</div>
