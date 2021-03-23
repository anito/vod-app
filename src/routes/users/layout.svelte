<script>
  import { stores } from '@sapper/app';
  import { GridItem, LayoutGrid } from '@sveltejs/site-kit';
  import { Breadcrumb } from 'components';

  export let stretch = false;
  export let sidebar = false;

  const { page } = stores();

  let segment = $page.path.match(/\/([a-z_-]*)/)[1];
</script>

<LayoutGrid {segment} {stretch} {sidebar}>
  <GridItem name="content" let:inner>
    <div class={inner}>
      {#if segment}
        <Breadcrumb {segment} />
      {/if}
      <slot />
    </div>
  </GridItem>
  <GridItem name="side" let:inner>
    <div class={inner}>
      <slot name="side">Sidebar</slot>
    </div>
  </GridItem>
  <GridItem vcenter name="footer" let:inner>
    <div class="{inner} ml-1">
      <slot name="footer">Footer</slot>
    </div>
  </GridItem>
  <GridItem vcenter name="ad" let:inner>
    <div class="{inner} ml-1">
      <slot name="ad">Advertisement</slot>
    </div>
  </GridItem>
</LayoutGrid>

<style>
  :global(.light-grey-background) {
    background: var(--back-grid-item) !important;
  }
</style>
