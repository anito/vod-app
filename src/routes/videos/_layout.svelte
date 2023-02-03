<script context="module">
  import * as api from 'api';

  export async function preload(page, { user }) {
    let usersData = [],
      videosData = [],
      imagesData = [];

    await api
      .get('users?limit=100', user?.jwt)
      .then((res) => {
        res.success && (usersData = res.data);
      })
      .catch(() => this.error());

    await api
      .get('videos?limit=100', user?.jwt)
      .then((res) => {
        res.success && (videosData = res.data);
      })
      .catch(() => this.error());

    await api
      .get('images?limit=100', user?.jwt)
      .then((res) => {
        res.success && (imagesData = res.data);
      })
      .catch(() => this.error());

    return { usersData, videosData, imagesData };
  }
</script>

<script>
  import { goto, stores } from '@sapper/app';
  import Layout from './layout.svelte';
  import List, { Item, Graphic, Separator, Text } from '@smui/list';
  import Textfield from '@smui/textfield';
  import { Icon } from '@smui/icon-button';
  import { Legal, PageBar, SimpleVideoCard } from 'components';
  import { images, videos, users } from 'stores';
  import { sortByTitle } from 'utils';
  import { _ } from 'svelte-i18n';

  const { page, session } = stores();

  export let usersData = [];
  export let videosData = [];
  export let imagesData = [];

  let selectedIndex;
  let search = '';

  $: users.update(usersData);
  $: videos.update(videosData);
  $: images.update(imagesData);
  $: sidebar = !!$page.params.slug;
  $: selectionVideoId = $page.params.slug;
  $: filteredVideos = $videos
    .filter((video) => video.title?.toLowerCase().indexOf(search.toLowerCase()) !== -1)
    .sort(sortByTitle);

  function itemSelectedHandler(e) {
    let { video } = e.detail;

    if (video.id != selectionVideoId) {
      goto(`videos/${video.id}`);
    }
  }
</script>

<Layout {sidebar}>
  <div class="flex flex-1" slot="pagebar">
    <PageBar />
  </div>
  <slot />
  <div class="sidebar" slot="side" style="flex: 1;">
    <div class="flex flex-col">
      <Textfield
        class="search"
        variant="filled"
        bind:value={search}
        label={$_('text.search-video')}
        input$aria-controls="helper-text"
        input$aria-describedby="helper-text"
      >
        <Icon
          role="button"
          class="material-icons-outlined cancel-search"
          slot="trailingIcon"
          on:click={() => (search = '')}>{search.length && 'cancel'}</Icon
        >
      </Textfield>
    </div>
    <List class="video-list" twoLine avatarList singleSelection bind:selectedIndex>
      {#if filteredVideos.length}
        {#each filteredVideos as video (video.id)}
          <SimpleVideoCard
            class="video"
            selected={selectionVideoId === video.id}
            on:itemSelected={itemSelectedHandler}
            {video}
          />
        {/each}
      {:else}
        <li class="flex flex-1 flex-col self-center text-center">
          <div class="m-5">{$_('text.no-videos')}</div>
        </li>
      {/if}
    </List>
  </div>
  <div slot="ad"><Legal /></div>
  <div slot="footer" class="flex justify-between">
    <div class="m-auto ml-0" />
    <div class="m-auto mr-0" />
  </div>
</Layout>

<style>
  :global(.cancel-search) {
    cursor: pointer;
  }
</style>
