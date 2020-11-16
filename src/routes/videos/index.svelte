<script context="module">
  import * as api from "api.js";

  let TABS = ["videos"];

  export async function preload(page, { role, user }) {
    let data;
    let query = page.query;

    if ("Administrator" === role) {
      TABS.push("images");
    }
    let tab = (query.tab && TABS.find((itm) => itm === query.tab)) || TABS[0];

    const res = await api.get(tab, user && user.token);
    if (res.success) {
      data = res.data;
      return { data, tab };
    }
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";
  import { onMount } from "svelte";
  import Button, { Group, Label, Icon } from "@smui/button";
  import { VideoManager, ImageManager, Component } from "components";
  import { Header } from "@sveltejs/site-kit";
  import { videos } from "../../stores/videoStore";
  import { images } from "../../stores/imageStore";

  // available from preload
  export let data = [];
  export let tab = "videos";

  let { session } = stores();

  $: "videos" === tab && videos.update(data);
  $: "images" === tab && images.update(data);

  onMount(() => "Administrator" === $session.role && changeTab(tab));

  async function changeTab(tab) {
    await goto(`videos?tab=${tab}`);
    return false;
  }
</script>

<style>
  .grid {
    display: grid;
    grid-template-areas:
      "one"
      "two";
    grid-template-rows: var(--toolbar-h) auto;
    grid-template-columns: 1fr;
    grid-gap: var(--grid-gap);
    height: calc(100% - var(--breadcrumb-h));
    align-items: initial;
  }
  .grid-item {
    background: var(--back-grid-item);
    padding-left: 0.4rem;
  }
  .one {
    grid-area: one;
    display: flex;
    align-items: center;
    height: var(--toolbar-h);
  }
  .two {
    grid-area: two;
  }
</style>

<svelte:head>
  <title>Physiotherapy Online | Video-Kurse</title>
</svelte:head>

{#if 'Administrator' === $session.role}
  <div class="grid {tab}">
    <div class="grid-item one">
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
          <Icon class="material-icons">collections</Icon>
          <Label>Posters</Label>
        </Button>
      </Group>
    </div>

    <div class="grid-item two">
      {#if tab === TABS[0]}
        <VideoManager />
      {/if}
      {#if tab === TABS[1]}
        <ImageManager />
      {/if}
    </div>
  </div>
{:else}
  <Component>
    <div slot="header">
      <Header h="2" mdc class="m-2 lg:m-5">
        Your Video Subscriptions (
        {@html ($session.user && $session.user.name) || 'Unnamed'})
      </Header>
    </div>
    <VideoManager />
  </Component>
{/if}
