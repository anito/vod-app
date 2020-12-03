<script>
  import Layout from "./layout.svelte";

  export let segment;
</script>

<div class:segment>
  <Layout>
    <slot />
    <div slot="ad" />
    <div slot="footer" />
  </Layout>
</div>
