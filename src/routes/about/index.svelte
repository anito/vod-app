<script>
    import { Header } from '@sveltejs/site-kit';
    import Table from '../_components/_Table.svelte';

</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<div class="grid">
    <div class="cols-3">
        <Header h=4 mdc>About this site</Header>
    </div>
    <div class="cols-3">
        <Table />
    </div>
</div>