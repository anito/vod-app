<script context="module">
  import * as api from "api";

  export async function preload(page, { user }) {
    let data;

    const res = await api.get("images", user && user.token);

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
  import { onMount, getContext } from "svelte";
  import { stores } from "@sapper/app";
  import Layout from "./layout.svelte";
  import { Legal, PageBar } from "components";
  import { images, videos, urls, videoEmitter } from "stores";
  import { locale, _ } from "svelte-i18n";

  const { page, session } = stores();
  const { getSnackbar, configSnackbar } = getContext("snackbar");

  export let data = [];

  // hydrate images store
  images.update(data);

  let snackbar;
  let user = $session.user;

  async function put(item) {
    const res = await api.put(
      `videos/${item.id}?lang=${$locale}`,
      item,
      user && user.token
    );
    if (res && res.success) {
      let message = res.message || res.data.message;
      snackbar.isOpen && snackbar.close();
      configSnackbar(message);
      snackbar.open();
      videos.put(item);
    }
  }

  async function get() {
    const res = await api.get("videos", user && user.token);
    if (res && res.success) {
      videos.update(res.data);
    }
  }

  async function del(item) {
    const res = await api.del(
      `videos/${item.id}?lang=${$locale}`,
      user && user.token
    );
    if (res && res.success) {
      let message = res.message || res.data.message;
      snackbar.isOpen && snackbar.close();
      configSnackbar(message);
      snackbar.open();

      urls.del(item.id);
      videos.del(item.id);
    }
  }

  let unsubscribe = videoEmitter.subscribe((t) => {
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

  onMount(() => {
    snackbar = getSnackbar();
    return unsubscribe;
  });
</script>

<Layout>
  <div class="flex flex-1" slot="pagebar">
    <PageBar />
  </div>
  <slot />
  <div slot="ad"><Legal /></div>
  <div slot="footer" class="flex justify-between">
    <div class="m-auto ml-0" />
    <div class="m-auto mr-0" />
  </div>
</Layout>
