<script>
  import Layout from './layout.svelte';
  import { Ticker } from 'components';

  export let segment;
</script>

<div class:segment>
  <Layout>
    <slot />
    <div slot="ad" />
    <div slot="footer" class="flex justify-between">
      <div class="m-auto ml-0" />
      <div class="m-auto mr-0"><Ticker /></div>
    </div>
  </Layout>
</div>
