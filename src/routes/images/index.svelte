<script context="module">
  import * as api from "api.js";

  export async function preload({ path }, { user }) {
    let data;
    const res = await api.get("images", user && user.token);

    if (res && res.success) {
      data = res.data;
      return { data };
    } else {
      this.error(
        (res.data && res.data.code) || res.status,
        (res.data && res.data.message) || res.responseText
      );
    }
  }
</script>

<script>
  import { stores, goto } from "@sapper/app";
  import { getContext } from "svelte";
  import { fly } from "svelte/transition";
  import Fab, { Icon } from "@smui/fab";
  import { Label } from "@smui/common";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import { Info, ImageUploader, ImageCard } from "components";
  import { Header } from "@sveltejs/site-kit";
  import { currentImage } from "../../stores/currentImageStore";
  import { images } from "../../stores/imageStore";

  export let data = {};

  images.update(data);

  const { session } = stores();
  const { open } = getContext("simple-modal");

  let user;

  let openUploader = () => {
    open(
      ImageUploader,
      {},
      {
        transitionWindow: fly,
        transitionWindowProps: {
          y: -200,
          duration: 500,
        },
      }
    );
  };

  function setCurrentImage(e) {
    currentImage.set(e.detail);
  }
</script>

<style>
</style>

<svelte:head>
  <title>Physiotherapy Online | Posters</title>
</svelte:head>

<Header h="2" mdc class="m-2 lg:m-5">Posters</Header>
<div class="lg:m-8">
  {#if (user = $session.user)}
    {#if $images.length}
      <div class="flex flex-wrap flex-row justify-center lg:justify-start">
        {#each $images as image (image.id)}
          <div class="flex m-1">
            <ImageCard on:Image:lastSelected={setCurrentImage} {image} {user} />
          </div>
        {/each}
      </div>
    {:else}
      <div class="paper-container flex justify-center">
        <Paper color="primary">
          <Title style="color: var(--text-light)">No Images available</Title>
          <Content>
            <a href="/images" on:click|preventDefault={openUploader}>Upload</a>
            some images to your content
          </Content>
        </Paper>
      </div>
    {/if}
    <Fab class="floating-fab" color="primary" on:click={openUploader} extended>
      <Label>Add Poster</Label>
      <Icon class="material-icons">add</Icon>
    </Fab>
  {:else}
    <div class="paper-container flex justify-center m-8">
      <Info title="Unauthorized" let:href>
        <a {href} on:click|preventDefault={() => goto(href)}>Login</a>
      </Info>
    </div>
  {/if}
</div>
