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
  import Layout from "./layout.svelte";
  import { Legal, PageBar } from "components";
  import { images } from "stores";

  export let data = [];

  // hydrate images store
  images.update(data);
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
