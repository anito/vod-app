<script context="module">
    import * as api from 'api.js';
    import { get  as receive} from 'svelte/store';
    import { videos } from '../../stores/videoStore';
    import { images } from '../../stores/imageStore';
    import { crud } from '../../stores/crudStore';
    import { equals } from 'utils';

    let _user;

    export async function preload( page, { user } ) {
        _user = user;

        const res = await api.get( 'videos', user && user.token );

        if( res.success ) {
            vids = receive(videos)
            data = res.data;
            if(!equals(vids, data)) videos.update( data );
        } else {
            videos.set( [] );
        }
    }

    async function put(item) {
        
        const res = await api.put(`videos/${item.id}`, item, _user && _user.token);
        if(res && res.success) {
            videos.put( item )
        }
    }

    async function get() {
        
        const res = await api.get( 'videos', _user && _user.token );
        if( res.success ) {
            videos.update( res.data );
        }
    }

    urls.subscribe( (items) => {
        // console.log( 'because I subscribed:', items )
    } )

    crud.subscribe( t => {
        
        if( 'post' === t.method ) {
            post(t.data)
        }
        if( 'put' === t.method ) {
            put(t.data)
        }
        if( 'get' === t.method ) {
            get(t.data)
        }
        if( 'del' === t.method ) {
            del(t)
        }
    } )

</script>

<script>
    import { stores } from '@sapper/app';
    import { getContext } from 'svelte';
    import { fly } from 'svelte/transition';
    import Fab, {Icon} from '@smui/fab';
    import { Label } from '@smui/common';
    import Paper, {Title, Subtitle, Content} from '@smui/paper';
	import { VideoCard } from 'components';
    import { VideoUploader } from 'components';
    import { urls } from '../../stores/urlStore';
    import { currentVideo } from '../../stores/currentVideoStore';
    import Layout from './layout.svelte';
    import { Header } from '@sveltejs/site-kit';
    import { Unauthorized } from 'components';
    
    const { session } = stores();
    const { open } = getContext('simple-modal');

    $: user = $session.user;

    let openUploader = () => {
        open( VideoUploader, {}, {
            transitionWindow: fly,
			transitionWindowProps: {
				y: -200,
				duration: 500
			},
        } )
    }

    function setCurrentVideo(e) {
        currentVideo.set( e.detail );
    }

</script>

<style>

</style>

<svelte:head>
	<title>Physiotherapy Online | Video-Kurse</title>
</svelte:head>

<Layout>
    <Header h=2 mdc class="m-2 lg:m-5">Videos</Header>
    <div class="lg:m-8">
        {#if user = $session.user }
            {#if $videos.length }
                <div class="flex flex-wrap flex-row lg:justify-start justify-center">
                    {#each $videos as video (video.id)}
                        <div class="flex mx-1 my-2">
                            <VideoCard
                                on:Video:current={setCurrentVideo}
                                {video}
                                {images}
                                {user}
                            />
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="paper-container flex justify-center">
                    <Paper color="primary" class="paper-demo">
                        <Title style="color: var(--text-light)">No Videos available</Title>
                        <Content><a href="/videos" on:click|preventDefault={openUploader}>Upload</a> some videos to your content</Content>
                    </Paper>
                </div>
            {/if}
            <Fab class="floating-fab" color="primary" on:click={openUploader} extended><Label>Add Video</Label><Icon class="material-icons">add</Icon></Fab>
        {:else}
            <div class="paper-container flex justify-center m-8">
                <Unauthorized />
            </div>
        {/if}
    </div>
    <div slot="ad">
        Videos Ad
    </div>
    <div slot="footer">
        Videos Footer
    </div>
</Layout>
