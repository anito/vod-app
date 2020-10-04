<script>
    import { Header } from '@sveltejs/site-kit';
    import { Table } from 'components';
    import Layout from './layout.svelte';

</script>

<svelte:head>
	<title>Physiotherapy Online | About</title>
</svelte:head>

<Layout>
    <Header h=4 mdc class="m-2 lg:m-5">About this site</Header>
    <div class="grid">
        <div class="cols-3">
            <Table />
        </div>
    </div>
    <div slot="ad">About Ad</div>
    <div slot="footer">About Footer</div>
</Layout>