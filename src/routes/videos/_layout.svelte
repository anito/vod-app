<script context="module">
  import * as api from "api.js";

  export async function preload(page, { user }) {
    let data;

    const res = await api.get("images", user && user.token);

    if (res.success) {
      data = res.data;
      return { data };
    } else {
      this.error(res.data.code, res.data.message);
    }
  }
</script>

<script>
  import { Modal } from "@sveltejs/site-kit";
  import Layout from "./layout.svelte";
  import { stores } from "@sapper/app";
  import { images } from "../../stores/imageStore";
  import { videos } from "../../stores/videoStore";
  import { videoEmitter } from "../../stores/videoEmitter";

  const { session } = stores();
  let user = $session.user;

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
  export let data = [];

  images.update(data);
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
