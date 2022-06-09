<script>
  import { stores } from "@sapper/app";
  import { GridItem, LayoutGrid } from "components";

  export let stretch = false;

  const { page } = stores();

  let segment = $page.path.match(/\/([a-z_-]*)/)[1];
</script>

<LayoutGrid fullscreen {segment} {stretch}>
  <GridItem name="content" let:inner>
    <div class={inner}>
      <slot />
    </div>
  </GridItem>
  <GridItem vcenter name="footer" let:inner>
    <div class={inner}>
      <slot name="footer" />
    </div>
  </GridItem>
  <GridItem vcenter name="ad" let:inner>
    <div class={inner}>
      <slot name="ad" />
    </div>
  </GridItem>
</LayoutGrid>

<style>
</style>
