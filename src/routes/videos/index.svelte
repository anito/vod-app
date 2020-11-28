<script context="module">
  import * as api from "api.js";

  export async function preload(page, { role, user }) {
    let tabs = ["videos", "images"];
    let data;
    let query = page.query;
    let tab = (query.tab && tabs.find((itm) => itm === query.tab)) || tabs[0];

    const res = await api.get(tab, user && user.token);
    if (res && res.success) {
      data = res.data;
      return { data, tabs, tab };
    } else {
      this.error(
        (res.data && res.data.code) || res.status,
        (res.data && res.data.message) || res.responseText
      );
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
  export let tabs;
  export let data = [];
  export let tab = "videos";

  let { session } = stores();

  $: "videos" === tab && videos.update(data);
  $: "images" === tab && images.update(data);

  onMount(() => $session.role === "Administrator" && changeTab(tab));

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
          on:click={() => changeTab(tabs[0])}
          variant={tab === tabs[0] ? 'unelevated' : ''}>
          <Icon class="material-icons">video_settings</Icon>
          <Label>Videos</Label>
        </Button>

        <Button
          class="focus:outline-none focus:shadow-outline"
          on:click={() => changeTab(tabs[1])}
          variant={tab === tabs[1] ? 'unelevated' : ''}>
          <Icon class="material-icons">collections</Icon>
          <Label>Posters</Label>
        </Button>
      </Group>
    </div>

    <div class="grid-item two">
      {#if tab === tabs[0]}
        <VideoManager />
      {/if}
      {#if tab === tabs[1]}
        <ImageManager />
      {/if}
    </div>
  </div>
{:else}
  <Component>
    <div slot="header">
      <Header h="2" mdc class="m-2 lg:m-5">
        {@html `Your Video Subscriptions <strong>(${($session.user && $session.user.name) || 'Unnamed'})</strong>`}
      </Header>
    </div>
    <VideoManager />
  </Component>
{/if}
