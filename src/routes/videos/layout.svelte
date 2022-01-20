<script>
  import { GridItem, LayoutGrid } from "@anito/site-kit";
  import { Breadcrumb, SessionTicker } from "components";
  import { proxyEvent } from "utils";
  import { stores } from "@sapper/app";

  export let stretch = false;
  
  const { page } = stores();

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
          <SessionTicker
            class="light"
            warning="180"
            warningOnly
            forceOnExtend="2"
            on:MDCChip:interaction={() => proxyEvent("session:extend")}
          />
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
