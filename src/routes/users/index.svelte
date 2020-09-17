<script>
	import { stores } from '@sapper/app';
    import { Header } from '@sveltejs/site-kit';
    import Paper, {Title, Subtitle, Content} from '@smui/paper';
    import Layout from './layout.svelte';
    import { Unauthorized } from 'components';

    const {session} = stores();
    
</script>

<Layout sidebar>
    <Header h=2 mdc class="m-2 lg:m-5">Users</Header>
    <div class="m-8">
        {#if $session.role === "Administrators"}
        <div>Content</div>
        {:else}
        <div class="paper-container flex justify-center">
            <Unauthorized />
        </div>
        {/if}
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