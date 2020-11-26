<script context="module">
  import * as api from "api";

  export async function preload(page, { user }) {
    const res = await api.get("images", user && user.token);

    if (!res || !res.success) {
      this.error(
        (res.data && res.data.code) || res.status,
        (res.data && res.data.message) || res.responseText
      );
    }
  }
</script>

<script>
  import Layout from "./layout.svelte";
  import { Info } from "components";
  import { stores, goto } from "@sapper/app";
  import { images } from "../../stores/imageStore";
  import { avatars } from "../../stores/avatarStore";
  import { videoEmitter } from "../../stores/videoEmitter";
  import { currentVideo } from "../../stores/currentVideoStore";

  export let segment;

  let { session } = stores();

  function handleUpload(e) {
    (e.detail.type === "image" && images.add(e.detail.data)) ||
      (e.detail.type === "avatar" && avatars.add(e.detail.data));

    let video;
    if (!(video = $currentVideo)) return;

    console.log(e);
    return;
    // take the last element for our poster
    let image_id = e.detail.data.slice(-1)[0].id;

    // only required for cakes customized finder methods
    // eg "findWithImages" which return assoziated models
    // video.image = null;
    video.image_id = image_id;

    videoEmitter.dispatch({
      method: "put",
      data: video,
    });
  }
</script>

<style>
  .paper-container {
    display: flex;
    flex: 1;
    justify-content: center;
  }
  .vcentered {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>

<div class:segment>
  <Layout>
    {#if $session.role === 'Administrator'}
      <slot />
    {:else}
      <div class="paper-container">
        <div class="vcentered">
          <Info title="Unauthorized" let:href>
            <a {href} on:click|preventDefault={() => goto(href)}>Login</a>
          </Info>
        </div>
      </div>
    {/if}
    <div slot="ad">Images Ad</div>
    <div slot="footer">Images Footer</div>
  </Layout>
</div>
