<script>
    import { onMount } from 'svelte';
    import { Media, MediaContent } from '@smui/card';
    import { Preview } from '@vime-js/preview';
    
    export let media;
    export let src = '';
    export let poster = `https://via.placeholder.com/320x180.png?text=`;
    export let headline = 'A headline';
    export let subtitle = 'A subtitle';

    let preview;
    $: poster = src || poster + getExt(media.src);

    let getExt = ( fn ) => {
        let match = fn.match( /[A-Za-z0-9]+$/);
        return match.length && match[0].toLowerCase();
    }

    onMount(() => {
        /**
         * If you need to call any methods, you have access 
         * to the preview instance here.
         **/
    });

</script>

<style>
    .text-wrapper {
        position: absolute;
        bottom: 16px;
        left: 16px;
        z-index: 2;
    }
    .text-wrapper h2, .text-wrapper h3 {
        color: var(--text-light);
    }

</style>
<Media aspectRatio="16x9">
    <MediaContent style="z-index: 0;">
        <div class="text-wrapper">
            <h2 class="mdc-typography--headline6" style="margin: 0;">{headline || media.title}</h2>
            <h3 class="mdc-typography--subtitle2" style="margin: 0;">{subtitle || media.subscription}</h3>
        </div>
        <Preview bind:this={preview} {poster}/>
    </MediaContent>
</Media>