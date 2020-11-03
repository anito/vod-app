<script context="module">
  import * as api from "api.js";
  import { videos } from "../../stores/videoStore";
  import { images } from "../../stores/imageStore";

  export async function preload(page, { user }) {
    let videoData, imageData;

    const resVideo = await api.get("videos", user && user.token);

    if (resVideo.success) {
      videoData = resVideo.data;
    } else {
      this.error(resVideo.status, resVideo.statusText);
    }

    const resImage = await api.get("images", user && user.token);

    if (resImage.success) {
      imageData = resImage.data;
    } else {
      this.error(resImage.status, resImage.statusText);
    }

    return { videoData, imageData };
  }
</script>

<script>
  import { Modal } from "@sveltejs/site-kit";
  import Layout from "./layout.svelte";

  export let segment;
  export let imageData = [];
  export let videoData = [];

  videos.update(videoData);
  images.update(imageData);
</script>

<div class:segment>
  <Modal>
    <Layout>
      <slot />
      <div slot="ad">Videos Ad</div>
      <div slot="footer">Videos Footer</div>
    </Layout>
  </Modal>
</div>
