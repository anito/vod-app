<script>
	import { onMount, setContext } from 'svelte';
    import { Header, Modal } from '@sveltejs/site-kit';
    import Layout from './layout.svelte';
    
</script>

<Layout sidebar>
    <Modal>
        <Header h=2 mdc class="my-8">Users Layout</Header>
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
    </Modal>
</Layout>