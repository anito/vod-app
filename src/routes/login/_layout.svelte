<script>
  import Layout from "./layout.svelte";
  import { Legal } from "components";

  export let segment;
</script>

<Layout {segment}>
  <slot />
  <div slot="ad"><Legal /></div>
  <div slot="footer" class="flex justify-between">
    <div class="m-auto ml-0" />
    <div class="m-auto mr-0" />
  </div>
</Layout>
