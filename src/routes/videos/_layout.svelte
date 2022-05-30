<script context="module">
  import { images, videos, users } from "stores";
  import * as api from "api";

  export async function preload(page, { user }) {
    let usersData = [],
      videosData = [],
      imagesData = [];

    const resUsers = await api.get("users", user?.token);
    if (resUsers && resUsers.success) {
      usersData = resUsers.data;
      users.update(usersData);
    } else {
      this.error();
    }

    const resVideos = await api.get("videos", user?.token);
    if (resVideos && resVideos.success) {
      videosData = resVideos.data;
      videos.update(videosData);
    } else {
      this.error();
    }

    const resImages = await api.get("images", user?.token);
    if (resImages && resImages.success) {
      imagesData = resImages.data;
      images.update(imagesData);
    } else {
      this.error();
    }
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";
  import Layout from "./layout.svelte";
  import List, { Item, Graphic, Separator, Text } from "@smui/list";
  import Textfield from "@smui/textfield";
  import { Icon } from "@smui/icon-button";
  import { Legal, PageBar, SimpleVideoCard } from "components";
  import { _, locale } from "svelte-i18n";

  const { page, session } = stores();

  let selectedIndex;
  let search = "";

  $: sidebar = !!$page.params.slug;
  $: selectionVideoId = $page.params.slug;
  $: filteredVideos = $videos.filter(
    (video) => video.title?.toLowerCase().indexOf(search.toLowerCase()) !== -1
  );

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
        label={$_("text.search-video")}
        input$aria-controls="helper-text"
        input$aria-describedby="helper-text"
      >
        <Icon
          role="button"
          class="material-icons-outlined cancel-search"
          slot="trailingIcon"
          on:click={() => (search = "")}>{search.length && "cancel"}</Icon
        >
      </Textfield>
    </div>
    <List
      class="video-list"
      twoLine
      avatarList
      singleSelection
      bind:selectedIndex
    >
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
          <div class="m-5">{$_("text.no-videos")}</div>
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
