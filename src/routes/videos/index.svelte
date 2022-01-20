<script context="module">
  import * as api from 'api';
  import { users } from "stores/userStore";
  import { videos } from "stores/videoStore";

  const TABS = ['videos', 'images'];

  export async function preload(page, { role, user }) {
    let tabs = TABS;
    let query = page.query;
    let tab = (query.tab && tabs.find((itm) => itm === query.tab)) || tabs[0];
    let usersData = [],
      videosData = [];

    const resUsers = await api.get("users", user && user.token);

    if (resUsers && resUsers.success) {
      usersData = resUsers.data;
      users.update(usersData);
    } else {
      this.error();
    }

    const resVideos = await api.get('videos', user && user.token);
    if (resVideos && resVideos.success) {
      videosData = resVideos.data;
      videos.update(videosData);
    } else {
      this.error();
    }

    return { usersData, videosData, tabs, tab };
  }
</script>

<script>
  import { goto, stores } from '@sapper/app';
  import { onMount } from 'svelte';
  import Button, { Group, Label, Icon } from '@smui/button/styled';
  import { VideoManager, ImageManager, Component } from 'components';
  import { Header } from '@anito/site-kit';
  import { extendSession } from 'utils';
  import { _ } from 'svelte-i18n';

  // available from preload
  export let tabs = TABS;
  export let usersData = [];
  export let videosData = [];
  export let tab = 'videos';

  let { session } = stores();

  users.update(usersData);
  videos.update(videosData);

  onMount(() => {
    $session.role === 'Administrator' && changeTab(tab);
    extendSession();
  });

  async function changeTab(tab) {
    await goto(`videos?tab=${tab}`);
    return false;
  }
</script>

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
          variant={tab === tabs[0] ? 'unelevated' : ''}
        >
          <Icon class="material-icons">video_settings</Icon>
          <Label>Videos</Label>
        </Button>

        <Button
          class="focus:outline-none focus:shadow-outline"
          on:click={() => changeTab(tabs[1])}
          variant={tab === tabs[1] ? 'unelevated' : ''}
        >
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
      <div class="flex justify-between">
        <span class="self-center">
          <Header h="6" mdc class="m-2 lg:m-5">{$_('text.your-classes')}</Header>
        </span>
        <span class="self-center">
          <Header h="5" mdc>
            {@html ($session.user && $session.user.name) || ''}
          </Header>
        </span>
      </div>
    </div>
    <VideoManager />
  </Component>
{/if}

<style>
  .grid {
    display: grid;
    grid-template-areas:
      'one'
      'two';
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
    overflow: auto;
  }
</style>
