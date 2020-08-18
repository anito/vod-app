<script>
    import { onMount } from 'svelte';
    import { Media, MediaContent } from '@smui/card';
    import { Preview } from '@vime-js/preview';
    import { getExt } from 'utils.js';
    
    export let media = {};
    export let src = null;
    export let poster = `https://via.placeholder.com/320x180.png?text=`;

    let preview;
    $: poster = src || poster + getExt(media.src) || '';

    onMount(() => {
        /**
         * If you need to call any methods, you have access 
         * to the preview instance here.
         **/
    });

</script>

<style>

</style>
<Media aspectRatio="16x9">
    <MediaContent style="z-index: 0;">
        <Preview bind:this={preview} {poster}/>
    </MediaContent>
</Media>