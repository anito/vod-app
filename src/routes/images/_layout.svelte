<script context="module">
  import * as api from "api.js";

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
  import { Modal } from "@sveltejs/site-kit";
  import Layout from "./layout.svelte";
  import { Info } from "components";
  import { stores, goto } from "@sapper/app";

  export let segment;

  let { session } = stores();
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
  <Modal>
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
  </Modal>
</div>
