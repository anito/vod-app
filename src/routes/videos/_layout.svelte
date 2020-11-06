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
      this.error(resVideo.data.code, resVideo.data.message);
    }

    const resImage = await api.get("images", user && user.token);

    if (resImage.success) {
      imageData = resImage.data;
    } else {
      this.error(resImage.data.code, resImage.data.message);
    }

    return { videoData, imageData };
  }
</script>

<script>
  import { Modal } from "@sveltejs/site-kit";
  import Layout from "./layout.svelte";
  import { stores } from "@sapper/app";
  import { videoEmitter } from "../../stores/videoEmitter";

  const { session } = stores();
  let user = session.user;

  async function put(item) {
    const res = await api.put(`videos/${item.id}`, item, user && user.token);
    if (res.success) {
      videos.put(item);
    }
  }

  async function get() {
    const res = await api.get("videos", user && user.token);
    if (res.success) {
      videos.update(res.data);
    }
  }

  videoEmitter.subscribe((t) => {
    if ("post" === t.method) {
      post(t.data);
    }
    if ("put" === t.method) {
      put(t.data);
    }
    if ("get" === t.method) {
      get(t.data);
    }
    if ("del" === t.method) {
      del(t.data);
    }
  });

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
