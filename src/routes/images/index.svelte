<script context="module">
    import * as api from 'api.js';
    import { images } from '../../stores/imageStore';

	export async function preload( { path }, { user }) {

		const res = await api.get( 'images', user && user.token );

        if( res.success ) {
            // console.log(res.data)
            images.update( res.data );
        } else {
            images.set( [] );
        }

	}
</script>

<script>
    import { goto, stores } from '@sapper/app';
    import { onMount, getContext, setContext } from 'svelte';
    import { fly } from 'svelte/transition';
    import List, {Item, Text, Graphic, Separator, Subheader} from '@smui/list';
    import Fab, {Icon} from '@smui/fab';
    import { Label } from '@smui/common';
    import Paper, {Title, Subtitle, Content} from '@smui/paper';
	import ImageList from '../_components/_ImageList.svelte';
	import ImageCard from '../_components/_ImageCard.svelte';
    import ImageUploader from '../_components/_ImageUploader.svelte';
    import { crud } from '../../stores/crudStore';
    import { urls } from '../../stores/urlStore';
    import { currentImage } from '../../stores/currentImageStore';

    const { session } = stores();
    const { open } = getContext('simple-modal');

    let user;

    async function put(item) {
        
        const response = await api.put(`images/${item.id}`, item, user.token);
        if(response && response.success) {
            // get();
            images.put( item )
        }
    }
    async function get() {
        
        const res = await api.get( 'images', user && user.token );

        if( res.success ) {
            // console.log(res.data)
            images.update( res.data );
        }
    }

    urls.subscribe( (items) => {
        console.log( 'because I subscribed:', items )
    } )
    session.subscribe(sess => {
        user = sess.user;
    })
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
	<title>Physiotherapy Online | Image-Kurse</title>
</svelte:head>

{#if user = $session.user }
    {#if $images.length }
        <div class="flex flex-wrap flex-row justify-start lg:justify-start sm:justify-center">
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
            <Paper color="primary" class="paper-demo">
                <Title style="color: var(--text-light)">No Images available</Title>
                <Content><a href="/images" on:click|preventDefault={openUploader}>Upload</a> some images to your content</Content>
            </Paper>
        </div>
    {/if}
    <Fab class="floating-fab" color="primary" on:click={openUploader} extended><Label>Add Image</Label><Icon class="material-icons">add</Icon></Fab>
{:else}
    <div class="paper-container flex justify-center">
      <Paper color="secondary" class="paper-demo">
        <Title style="color: var(--text-light)">Not Authorized</Title>
        <Content><a href="/login" on:click|preventDefault={() => goto('login')}>Login</a> to see content</Content>
      </Paper>
    </div>
{/if}
