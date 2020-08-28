<script context="module">
    import * as api from 'api.js';
    import {videos} from '../../stores/videoStore';
    import {images} from '../../stores/imageStore';
    import {crud} from '../../stores/crudStore';
    import {get as receive} from 'svelte/store';
    import {equals} from 'utils';

    let the_user;

	export async function preload( { path }, { user }) {

        the_user = user;
        let res;
        let vids;
        let imgs;
        let data;

        res = await api.get( 'videos', user && user.token );

        if( res.success ) {
            vids = receive(videos)
            data = res.data;
            if(!equals(vids, data)) videos.set( data );
        } else {
            videos.set( [] );
        }
		res = await api.get( 'images', user && user.token );

        if( res.success ) {
            imgs = receive(images)
            data = res.data;
            if(!equals(imgs, data)) images.set( data );
        } else {
            images.set( [] );
        }

    }

    async function put(item) {
        
        const response = await api.put(`videos/${item.id}`, item, the_user && the_user.token);
        if(response && response.success) {
            videos.put( item )
        }
    }

    async function get() {
        
        const res = await api.get( 'videos', the_user && the_user.token );

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
    import { goto, stores } from '@sapper/app';
    import { onMount, getContext, setContext } from 'svelte';
    import { fly } from 'svelte/transition';
    import List, {Item, Text, Graphic, Separator, Subheader} from '@smui/list';
    import Fab, {Icon} from '@smui/fab';
    import { Label } from '@smui/common';
    import Paper, {Title, Subtitle, Content} from '@smui/paper';
	import VideoCard from '../_components/_VideoCard.svelte';
    import VideoUploader from '../_components/_VideoUploader.svelte';
    import { urls } from '../../stores/urlStore';
    import { currentVideo } from '../../stores/currentVideoStore';
    
    const { session } = stores();
    const { open } = getContext('simple-modal');

    let user;
    
    session.subscribe(sess => {
        user = sess.user;
    })

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

{#if user = $session.user }
    {#if $videos.length }
        <div class="flex flex-wrap flex-row justify-start lg:justify-start sm:justify-start">
            {#each $videos as video (video.id)}
                <div class="flex m-1">
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
    <div class="paper-container flex justify-center">
      <Paper color="secondary" class="paper-demo">
        <Title style="color: var(--text-light)">Not Authorized</Title>
        <Content><a href="/login" on:click|preventDefault={() => goto('login')}>Login</a> to see content</Content>
      </Paper>
    </div>
{/if}
