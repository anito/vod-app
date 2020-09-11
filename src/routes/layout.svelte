<script>
    import { GridItem, LayoutGrid } from '@sveltejs/site-kit';
    import Breadcrumb from './_components/_Breadcrumb.svelte';

    export let segment;
    export let page;
</script>

<LayoutGrid {segment} {page} stretch>
	<GridItem name="content" let:inner>
		<div class="{inner}">
			{#if segment}
			<Breadcrumb {segment}/>
			{/if}
			<slot></slot>
		</div>
	</GridItem>
	{#if segment}
	{#if segment === 'users'}
	<GridItem name="side" let:inner>
		<div class="{inner}">
			<slot name="side">Sidebar</slot>
		</div>
	</GridItem>
    {/if}
	<GridItem name="footer" let:inner>
		<div class="{inner}">
			<slot name="footer">Footer</slot>
		</div>
	</GridItem>
	<GridItem name="ad" let:inner>
		<div class="{inner}">
			<slot name="ad">Advertisement</slot>
		</div>
	</GridItem>
	{/if}
</LayoutGrid>
