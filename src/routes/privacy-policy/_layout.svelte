<script>
  import Layout from './layout.svelte';

  export let segment;
</script>

<div class:segment>
  <Layout fullscreen>
    <slot />
    <div slot="ad" />
    <div slot="footer" class="flex justify-between">
      <div class="m-auto ml-0" />
      <div class="m-auto mr-0" />
    </div>
  </Layout>
</div>
