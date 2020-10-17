<script>
  import { Modal } from "@sveltejs/site-kit";
  import Layout from "./layout.svelte";
  import { Unauthorized } from "components";
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
            <Unauthorized />
          </div>
        </div>
      {/if}
      <div slot="ad">Images Ad</div>
      <div slot="footer">Images Footer</div>
    </Layout>
  </Modal>
</div>
