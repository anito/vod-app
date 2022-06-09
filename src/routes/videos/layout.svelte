<script>
  import { GridItem, LayoutGrid } from "components";
  import { stores } from "@sapper/app";

  export let stretch = false;
  export let sidebar = false;

  const { page } = stores();

  let segment = $page.path.match(/\/([a-z_-]*)/)[1];

  $: sidebar = !!$page.params.slug;
</script>

<LayoutGrid {segment} {stretch} {sidebar}>
  <GridItem name="pagebar" let:inner>
    <div class={inner}>
      <slot name="pagebar" />
    </div>
  </GridItem>
  <GridItem name="content" let:inner>
    <div class={inner}>
      <slot />
    </div>
  </GridItem>
  {#if sidebar}
    <GridItem name="side" let:inner>
      <div class={inner}>
        <slot name="side">Sidebar</slot>
      </div>
    </GridItem>
  {/if}
  <GridItem vcenter name="footer" let:inner>
    <div class={inner}>
      <slot name="footer">Footer</slot>
    </div>
  </GridItem>
  <GridItem vcenter hcenter name="ad" let:inner>
    <div class={inner}>
      <slot name="ad">Advertisement</slot>
    </div>
  </GridItem>
</LayoutGrid>

<style></style>
