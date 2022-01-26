<script>
  import { stores } from '@sapper/app';
  import { GridItem, LayoutGrid } from '@anito/site-kit';

  const { page } = stores();

  let segment = $page.path.match(/\/([a-z_-]*)/)[1];
</script>

<LayoutGrid {segment}>
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
  <GridItem vcenter name="footer" let:inner>
    <div class={inner}>
      <slot name="footer">Footer</slot>
    </div>
  </GridItem>
  <GridItem vcenter name="ad" let:inner>
    <div class={inner}>
      <slot name="ad">Advertisement</slot>
    </div>
  </GridItem>
</LayoutGrid>
