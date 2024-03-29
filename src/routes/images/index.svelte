<script context="module">
  import * as api from "api";

  export async function preload({ path }, { user }) {
    let data;
    const res = await api.get("images?limit=100", user?.jwt);

    if (res && res.success) {
      data = res.data;
      return { data };
    } else {
      this.error(
        (res.data && res.data.code) || res.status,
        res.message || res.responseText
      );
    }
  }
</script>

<script>
  import { stores, goto } from "@sapper/app";
  import { onMount, getContext } from "svelte";
  import { fly } from "svelte/transition";
  import Fab, { Icon } from "@smui/fab";
  import { Label } from "@smui/common";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import { Header, Info, ImageCard, MediaUploader } from "components";
  import { fabs, sitename, images, currentVideo } from "stores";
  import { _ } from "svelte-i18n";

  // available from preload
  export let data = [];
  images.update(data);

  const { session } = stores();
  const { open } = getContext("simple-modal");
  const { setFab } = getContext("fab");

  onMount(() => {
    if ($session.user) setFab("upload-image");
  });

  let openUploader = (type) => {
    open(
      MediaUploader,
      {
        type,
        options: {
          parallelUploads: 12,
          maxFiles: $currentVideo ? 1 : 12,
        },
      },
      {
        transitionWindow: fly,
        transitionWindowProps: {
          y: -200,
          duration: 500,
        },
      }
    );
  };
</script>

<svelte:head>
  <title>{$sitename} | Posters</title>
</svelte:head>

<Header h="2" mdc class="m-2 lg:m-5">Posters</Header>
<div class="lg:p-8">
  {#if $session.user}
    {#if $images.length}
      <div class="flex flex-wrap flex-row justify-center lg:justify-start">
        {#each $images as image (image.id)}
          <div class="flex flex-1 m-1">
            <ImageCard {image} user={$session.user} />
          </div>
        {/each}
      </div>
    {:else}
      <div class="flex justify-center">
        <Paper color="primary">
          <Title style="color: var(--text-light)">No Images available</Title>
          <Content>
            <a
              href="/images"
              on:click|preventDefault={() => openUploader("image")}>Upload</a
            >
            some images to your content
          </Content>
        </Paper>
      </div>
    {/if}
  {:else}
    <div class="flex justify-center m-8">
      <Info title="Unauthorized" let:href>
        <a {href} on:click|preventDefault={() => goto(href)}>Login</a>
      </Info>
    </div>
  {/if}
</div>
{#if $fabs === "upload-image"}
  <Fab
    class="floating-fab"
    color="primary"
    on:click={() => openUploader("image")}
    extended
  >
    <Label>{$_("text.new-poster")}</Label>
    <Icon class="material-icons">add</Icon>
  </Fab>
{/if}

<style>
</style>
