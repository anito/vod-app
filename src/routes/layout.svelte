<script>
  import { stores } from "@sapper/app";
  import { GridItem, LayoutGrid } from "@sveltejs/site-kit";

  const { page } = stores();

  let segment = $page.path.match(/\/([a-z_-]*)/)[1];
</script>

<LayoutGrid {segment}>
  <GridItem name="content" let:inner>
    <div class={inner}>
      <slot />
    </div>
  </GridItem>
</LayoutGrid>
