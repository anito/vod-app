<script context="module">
    import * as api from 'api.js';
    import { images } from '../../stores/imageStore';
    import { get as receive } from 'svelte/store';
    import { equals } from 'utils';
    import { Unauthorized } from 'components';

	export async function preload( { path }, { user }) {

        let imgs;
        let data;
		const res = await api.get( 'images', user && user.token );

        if( res.success ) {
            imgs = receive(images)
            data = res.data;
            if(!equals(imgs, data)) images.set( data );
            
        } else {
            images.set( [] );
        }

    }
    
</script>

<script>
    import { stores } from '@sapper/app';
    import { getContext } from 'svelte';
    import { fly } from 'svelte/transition';
    import List, {Item, Text, Graphic, Separator, Subheader} from '@smui/list';
    import Fab, {Icon} from '@smui/fab';
    import { Label } from '@smui/common';
    import Paper, {Title, Subtitle, Content} from '@smui/paper';
	import { ImageList } from 'components';
	import { ImageCard } from 'components';
    import { ImageUploader } from 'components';
    import Layout from './layout.svelte';
    import { Header } from '@sveltejs/site-kit';
    
    import { currentImage } from '../../stores/currentImageStore';

    const { session } = stores();
    const { open } = getContext('simple-modal');

    let user;

    let openUploader = () => {
        open( ImageUploader, {}, {
            transitionWindow: fly,
			transitionWindowProps: {
				y: -200,
				duration: 500
			},
        } )
    }

    function setCurrentImage(e) {
        currentImage.set( e.detail );
    }

</script>

<style>

</style>

<svelte:head>
	<title>Physiotherapy Online | Posters</title>
</svelte:head>

<Header h=2 mdc class="m-2 lg:m-5">Posters</Header>
<div class="lg:m-8">
    {#if user = $session.user }
        {#if $images.length }
            <div class="flex flex-wrap flex-row justify-center lg:justify-start">
                {#each $images as image (image.id)}
                    <div class="flex m-1">
                        <ImageCard
                            on:Image:lastSelected={setCurrentImage}
                            {image}
                            {user}
                        />
                    </div>
                {/each}
            </div>
        {:else}
            <div class="paper-container flex justify-center">
                <Paper color="primary">
                    <Title style="color: var(--text-light)">No Images available</Title>
                    <Content><a href="/images" on:click|preventDefault={openUploader}>Upload</a> some images to your content</Content>
                </Paper>
            </div>
        {/if}
        <Fab class="floating-fab" color="primary" on:click={openUploader} extended><Label>Add Poster</Label><Icon class="material-icons">add</Icon></Fab>
    {:else}
        <div class="paper-container flex justify-center m-8">
            <Unauthorized />
        </div>
    {/if}
</div>
