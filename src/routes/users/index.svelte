<script>
	import { onMount, setContext } from 'svelte';
    import { Header } from '@sveltejs/site-kit';
    import Layout from './layout.svelte';
    
</script>

<Layout sidebar>
    <Header h=2 mdc class="m-2 lg:m-5">Users Layout</Header>
    <div class="m-8">
        <div>Content</div>
    </div>
    <div slot="side">
        Users Sidebar
    </div>
    <div slot="ad">
        Users Ad
    </div>
    <div slot="footer">
        Users Footer
    </div>
</Layout>