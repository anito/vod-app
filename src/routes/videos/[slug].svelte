<script>
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";
  import { videos, users, videoEmitter } from "stores";
  import { Info, Display } from "components";
  import { VideoPlayer } from "components/Video";
  import { getMediaImage, getMediaVideo } from "utils";
  import { _, locale } from "svelte-i18n";

  const { page, session } = stores();

  let paused;
  let poster = "";
  let src = "";
  let joinData;
  let vid;
  let playhead;
  let canPlay = false;
  let timeoutId;

  $: video = $videos.find((v) => v.id === $page.params.slug);
  $: currentUser = $users.find((user) => user.id == $session.user.id);
  $: token = currentUser.token.token;
  $: isAdmin = $session.role === "Administrator";
  $: joinData =
    currentUser &&
    (vid = currentUser.videos.find((v) => v.id == video.id)) &&
    vid._joinData;
  $: ((id) => getMediaImage(id, $session.user).then((v) => (poster = v)))(
    video.image_id
  );
  $: ((id) => getMediaVideo(id, $session.user).then((v) => (src = v)))(
    video.id
  );
  $: ((time) => {
    if (!paused || !canPlay) return;
    let savedTime = time;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(
      (saved) => saved === playhead && savePlayhead(),
      500,
      savedTime
    );
  })(playhead);

  onMount(() => {
    return () => !paused && savePlayhead();
  });

  // set playhead to the last saved position when the video is ready to play
  function handleCanPlay(e) {
    if (canPlay) return;
    canPlay = true;
    playhead = isAdmin ? video.playhead : joinData.playhead;
  }

  function handleEmptied(e) {
    console.log(
      "%c EMPTIED   %c %s",
      "background: #8593a9; color: #ffffff; padding:4px 6px 3px 0;",
      "background: #dfe2e6; color: #000000; padding:4px 6px 3px 0;",
      e.detail.title
    );
  }

  function handleLoadStart(e) {
    console.log(
      "%c LOADSTART %c %s",
      "background: #8593a9; color: #ffffff; padding:4px 6px 3px 0;",
      "background: #dfe2e6; color: #000000; padding:4px 6px 3px 0;",
      e.detail.title
    );
  }

  function handleLoadedData(e) {
    console.log(
      "%c LOADEDDATA%c %s",
      "background: #8593a9; color: #ffffff; padding:4px 6px 3px 0;",
      "background: #dfe2e6; color: #000000; padding:4px 6px 3px 0;",
      e.detail.title
    );
  }

  function handleAborted(e) {
    console.log(
      "%c ABORTED   %c %s",
      "background: #8593a9; color: #ffffff; padding:4px 6px 3px 0;",
      "background: #dfe2e6; color: #000000; padding:4px 6px 3px 0;",
      e.detail.title
    );
    // in Chrome we have to limit streams do to Chromes limitation
    // this is done by emptying src attribute on the video which forgets the playheads position
    // setting canPlay to false will readjust playhead to last saved position when video CanPlay again
    paused = true;
    canPlay = false;
  }

  async function savePlayhead() {
    if (isAdmin) {
      videoEmitter.dispatch({
        method: "put",
        data: { ...video, playhead },
      });
    } else {
      let joinData,
        data,
        id = video.id,
        vid,
        associated = currentUser.videos
          .filter((v) => v.id != video.id)
          .map((v) => ({ id: v.id }));
      vid = currentUser.videos.find((v) => v.id == video.id);
      if (vid) {
        joinData = vid._joinData;
        data = {
          videos: [
            {
              id,
              _joinData: { ...joinData, playhead },
            },
            ...associated,
          ],
        };
        saveUser(data);
      }
    }
  }

  async function saveUser(data) {
    await api.put(`users/${currentUser.id}?lang=${$locale}`, data, token);
  }
</script>

{#if video}
  <div class="single-player flex bg-black">
    <VideoPlayer
      class="video-player flex single-player"
      bind:paused
      bind:playhead
      on:player:canplay={handleCanPlay}
      on:player:emptied={handleEmptied}
      on:player:loadeddata={handleLoadedData}
      on:player:loadstart={handleLoadStart}
      on:player:aborted={handleAborted}
      {video}
      {poster}
      {src}
      curtain
    />
  </div>
{:else}
  <div class="flex justify-center m-8">
    <Info title="No Video found" />
  </div>
{/if}

<style>
  .single-player {
    --player-w: 100vw;
    --curtain-lh-title: 4rem;
    --curtain-lh-descr: 2rem;
    --curtain-fs-title: 4rem;
    --curtain-fs-descr: 2rem;
    --curtain-p: 3rem;
    --curtain-c-title: #555555;
    --curtain-c-descr: #888888;
    --curtain-bg-left: #000000d0;
    --curtain-bg-right: #00000030;
  }
</style>
