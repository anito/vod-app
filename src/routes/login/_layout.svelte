<script>
  import Layout from './layout.svelte';
  import { Ticker } from 'components';

  export let segment;
</script>

<div class:segment>
  <Layout>
    <slot />
    <div slot="ad"><Ticker /></div>
    <div slot="footer" />
  </Layout>
</div>
