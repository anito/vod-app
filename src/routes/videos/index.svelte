<script>
  import * as api from "api.js";
  import { stores, goto } from "@sapper/app";
  import { getContext } from "svelte";
  import { fly } from "svelte/transition";
  import Fab, { Icon } from "@smui/fab";
  import { Label } from "@smui/common";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import { VideoCard } from "components";
  import { VideoUploader } from "components";
  import { urls } from "../../stores/urlStore";
  import { currentVideo } from "../../stores/currentVideoStore";
  import { Header } from "@sveltejs/site-kit";
  import { Info } from "components";
  import { videos } from "../../stores/videoStore";
  import { images } from "../../stores/imageStore";

  const { session } = stores();
  const { open } = getContext("simple-modal");
  const user = $session.user;

  urls.subscribe((items) => {
    // console.log( 'because I subscribed:', items )
  });

  let openUploader = () => {
    open(
      VideoUploader,
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

  function setCurrentVideo(e) {
    currentVideo.set(e.detail);
  }
</script>

<style>
</style>

<svelte:head>
  <title>Physiotherapy Online | Video-Kurse</title>
</svelte:head>

<Header h="2" mdc class="m-2 lg:m-5">Videos</Header>
<div class="lg:m-8">
  {#if user}
    {#if $videos.length}
      <div class="flex flex-wrap flex-row lg:justify-start justify-center">
        {#each $videos as video (video.id)}
          <div class="flex mx-1 my-2">
            <VideoCard on:Video:current={setCurrentVideo} {video} {images} />
          </div>
        {/each}
      </div>
    {:else}
      <div class="paper-container flex justify-center">
        <Paper color="primary" class="paper-demo">
          <Title style="color: var(--text-light)">No Videos available</Title>
          {#if $session.role === 'Administrator'}
            <Content>
              <a
                href="/videos"
                on:click|preventDefault={openUploader}>Upload</a>
              some videos to your content
            </Content>
          {/if}
        </Paper>
      </div>
    {/if}
    {#if $session.role === 'Administrator'}
      <Fab
        class="floating-fab"
        color="primary"
        on:click={openUploader}
        extended>
        <Label>Add Video</Label>
        <Icon class="material-icons">add</Icon>
      </Fab>
    {/if}
  {:else}
    <div class="paper-container flex justify-center m-8">
      <Info title="Unauthorized" let:href>
        <a {href} on:click|preventDefault={() => goto(href)}>Login</a>
      </Info>
    </div>
  {/if}
</div>
