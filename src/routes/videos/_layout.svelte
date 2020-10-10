<script context="module">
    import * as api from 'api.js';
    import { get } from 'svelte/store';
    import { videos } from '../../stores/videoStore';
    import { images } from '../../stores/imageStore';
    import { equals } from 'utils';

    export async function preload( page, { user } ) {

        let videoData, imageData;
        
        const resVideo = await api.get( 'videos', user && user.token );

        if( resVideo.success ) {
            videoData = resVideo.data;
        }
        
        const resImage = await api.get( 'images', user && user.token );

        if( resImage.success ) {
            imageData = resImage.data;
        }

        return { videoData, imageData };

    }
</script>

<script>
    import { Modal } from '@sveltejs/site-kit';
    import Layout from './layout.svelte';

    export let segment;
    export let imageData = [];
    export let videoData = [];

    videos.update(videoData);
    images.update(imageData);

</script>

<div class:segment>
    <Modal>
        <Layout>
            <slot></slot>
            <div slot="ad">
                Videos Ad
            </div>
            <div slot="footer">
                Videos Footer
            </div>
        </Layout>
    </Modal>
</div>
