<script>
  import Layout from "./layout.svelte";

  export let segment;
</script>

<div class:segment>
  <Layout>
    <slot />
  </Layout>
</div>
