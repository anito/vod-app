<script>
  import { stores } from '@sapper/app';
  import { GridItem, LayoutGrid } from '@sveltejs/site-kit';
  import { Breadcrumb, Ticker } from 'components';

  export let stretch = false;
  export let sidebar = false;

  const { page } = stores();

  let segment = $page.path.match(/\/([a-z_-]*)/)[1];
</script>

<LayoutGrid {segment} {stretch} {sidebar}>
  <GridItem name="content" let:inner>
    <div class={inner}>
      <div class="page-bar flex justify-between">
        <div class="breadcrumb-container m-auto ml-0">
          {#if segment}
            <Breadcrumb {segment} />
          {/if}
        </div>
        <div class="ticker-container m-auto mr-0">
          <Ticker />
        </div>
      </div>
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

<style></style>
