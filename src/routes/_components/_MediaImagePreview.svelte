<script>
    import { onMount } from 'svelte';
    import { Media, MediaContent } from '@smui/card';
    import { Preview } from '@vime-js/preview';
    import { getExt, getImage } from 'utils.js';
    
    const posterUrl = `https://via.placeholder.com/320x180.png?text=`;

    export let media = {};
    export let user;

    let preview;
    let poster = `${posterUrl}${getExt(media.src)}`;

    async function getPreview(id) {
        if(!id) return false;
		let res = await getImage(id, user, {width:300, height:300, square: 0});
		if(res) poster = res;
    }

    getPreview(media.id);

</script>

<style>

</style>
<Media aspectRatio="16x9">
    <MediaContent style="z-index: 0;">
        <Preview bind:this={preview} {poster}/>
    </MediaContent>
</Media>