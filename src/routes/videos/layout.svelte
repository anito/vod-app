<script>
  import { GridItem, LayoutGrid } from "@sveltejs/site-kit";
  import { Breadcrumb } from "components";
  import { stores } from "@sapper/app";

  const { page } = stores();

  export let stretch = false;

  let segment = $page.path.match(/\/([a-z_-]*)/)[1];
</script>

<LayoutGrid {segment} {stretch}>
  <GridItem name="content" let:inner>
    <div class={inner}>
      {#if segment}
        <Breadcrumb {segment} />
      {/if}
      <slot />
    </div>
  </GridItem>
  <GridItem vcenter name="footer" let:inner>
    <div class={inner}>
      <slot name="footer">Footer</slot>
    </div>
  </GridItem>
  <GridItem vcenter name="ad" let:inner>
    <div class="inner {inner}">
      <slot name="ad">Advertisement</slot>
    </div>
  </GridItem>
</LayoutGrid>
