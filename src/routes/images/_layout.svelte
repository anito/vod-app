<script context="module">
  import * as api from "api";

  export async function preload(page, { user }) {
    const res = await api.get("images", user && user.token);

    if (!res || !res.success) {
      this.error(
        (res.data && res.data.code) || res.status,
        res.message || res.responseText
      );
    }
  }
</script>

<script>
  import Layout from "./layout.svelte";
  import { Info } from "components";
  import { stores, goto } from "@sapper/app";

  export let segment;

  let { session } = stores();
</script>

<Layout>
  {#if $session.role === "Administrator"}
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
  <div slot="ad" />
  <div slot="footer" />
</Layout>

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
