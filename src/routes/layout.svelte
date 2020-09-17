<script>
	import { goto, stores } from '@sapper/app';
    import { GridItem, LayoutGrid } from '@sveltejs/site-kit';
    import { Breadcrumb } from 'components';

	const { page, preloading, session } = stores();

	let segment = $page.path.match(/\/([a-z_-]*)/)[1];

</script>

<LayoutGrid {segment}>
	<GridItem name="content" let:inner>
		<div class="{inner}">
			{#if segment}
			<Breadcrumb {segment}/>
			{/if}
			<slot></slot>
		</div>
	</GridItem>
</LayoutGrid>
