<script context="module">
  import * as api from "api.js";

  export async function preload({ params, query }, { user }) {
    const res = await api.get(`users/${params.slug}`, user && user.token);

    if (res.success) {
      const { id, name } = { ...res.data };
      return { id, name, ...query };
    } else {
      this.error(res.status, res.data.message);
    }
  }
</script>

<script>
  import { goto } from "@sapper/app";
  import { get } from "svelte/store";
  import { VideoManager, UserManager, TimeManager } from "components";
  import Button, { Group, Label, Icon } from "@smui/button";
  import { videos } from "../../stores/videoStore";
  import { users } from "../../stores/userStore";

  const TABS = ["user", "video", "time"];

  // available from preload
  export let id;
  export let name;
  export let tab = "user";

  let selectionUserId;

  $: selectionUserId = id;
  $: tab = ((t) => TABS.find((itm) => itm === t) || TABS[0])(tab);

  async function changeTab(tab) {
    const wait = await goto(`users/${selectionUserId}?tab=${tab}`);
    return false;
  }

  function getUserVideos(idx) {
    let userVideos;
    let _videos = get(videos);
    if ($users[idx] && (userVideos = $users[idx].videos) && userVideos.length) {
      return _videos.filter((v) => userVideos.find((uv) => uv.id === v.id));
    }
    return [];
  }
</script>

<style>
  .grid {
    display: grid;
    grid-template-areas:
      "toolbar toolbar"
      "one one";
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: var(--toolbar-h) auto;
    grid-gap: var(--grid-gap);
    height: 100%;
    align-items: center;
  }
  :global(.grid.video) {
    grid-template-areas:
      "toolbar toolbar"
      "one two";
  }
  :global(.grid.time) {
    grid-template-areas:
      "toolbar toolbar"
      "one one"
      "two two";
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

<div class="grid has-grid {tab}">
  <div class="grid-item toolbar">
    <Group variant="unelevated">
      <Button
        class="focus:outline-none focus:shadow-outline"
        on:click={() => changeTab(TABS[0])}
        variant={tab === TABS[0] ? 'unelevated' : ''}>
        <Icon class="material-icons">account_circle</Icon>
        <Label>Manage User</Label>
      </Button>
      <Button
        class="focus:outline-none focus:shadow-outline"
        on:click={() => changeTab(TABS[1])}
        variant={tab === TABS[1] ? 'unelevated' : ''}>
        <Icon class="material-icons">video_settings</Icon>
        <Label>Manage Videos</Label>
      </Button>
      <Button
        class="focus:outline-none focus:shadow-outline"
        on:click={() => changeTab(TABS[2])}
        variant={tab === TABS[2] ? 'unelevated' : ''}>
        <Icon class="material-icons">timer</Icon>
        <Label>Manage Time</Label>
      </Button>
    </Group>
  </div>
  {#if tab === TABS[0]}
    <UserManager {selectionUserId} />
  {/if}
  {#if tab === TABS[1]}
    <VideoManager {selectionUserId} {getUserVideos} />
  {/if}
  {#if tab === TABS[2]}
    <TimeManager {selectionUserId} {getUserVideos} />
  {/if}
</div>
