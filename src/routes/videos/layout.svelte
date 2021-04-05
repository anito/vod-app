<script>
  import { GridItem, LayoutGrid } from '@sveltejs/site-kit';
  import { Breadcrumb, Ticker } from 'components';
  import { proxyEvent } from 'utils';
  import { stores } from '@sapper/app';

  const { page } = stores();

  export let stretch = false;

  let segment = $page.path.match(/\/([a-z_-]*)/)[1];
</script>

<LayoutGrid {segment} {stretch}>
  <GridItem name="content" let:inner>
    <div class={inner}>
      <div class="page-bar flex justify-between">
        <div class="breadcrumb-container m-auto ml-0">
          {#if segment}
            <Breadcrumb {segment} />
          {/if}
        </div>
        <div class="ticker-container m-auto mr-0">
          <Ticker prefix="" class="" on:MDCChip:interaction={() => proxyEvent('session:extend')} />
        </div>
      </div>
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

<style></style>
