<script>
  import Layout from "./layout.svelte";

  export let segment;
</script>

<div class:segment>
  <Layout>
    <slot />
    <div slot="ad">About Ad</div>
    <div slot="footer">About Footer</div>
  </Layout>
</div>
