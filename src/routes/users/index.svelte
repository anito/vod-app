<script context="module">
    import * as api from 'api.js';
    import { get } from 'svelte/store';
    import { equals } from 'utils';
    import { users } from '../../stores/userStore';
    import { videos } from '../../stores/videoStore';

    export async function preload( { path }, { user } ) {

        // let vids, data;

        // const res = await api.get( 'videos', user && user.token );

        // if( res.success ) {
        //     vids = get(videos)
        //     data = res.data;
        //     if(!equals(vids, data)) videos.update( data );
        // } else {
        //     videos.set( [] );
        // }
        
    }

</script>

<script>
    import { GridItem, LayoutGrid } from '@sveltejs/site-kit';
    import Paper, {Title, Subtitle, Content} from '@smui/paper';

</script>

<style>
    .grid {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        grid-template-areas:
            "content";
        height: calc(100vh - var(--nav-h) - var(--footer-section-h))
    }
	.no-user {
        grid-area: content;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

<svelte:head>
	<title>Physiotherapy Online | Users</title>
</svelte:head>

<LayoutGrid>
    <GridItem name="content" let:inner vcenter hcenter>
        <div class="{inner}">
            <Paper color="primary">
                <Title style="color: var(--text-light)">No User Selected</Title>
            </Paper>
        </div>
    </GridItem>
</LayoutGrid>