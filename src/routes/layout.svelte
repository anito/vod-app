<script>
  import { stores } from "@sapper/app";
  import { GridItem, LayoutGrid, Legal } from "components";

  const { page } = stores();

  export let segment = $page.path.match(/\/([a-z_-]*)/)[1];
</script>

<LayoutGrid fullscreen {segment}>
  <GridItem name="content" let:inner>
    <div class={inner}>
      <slot />
    </div>
  </GridItem>
</LayoutGrid>
