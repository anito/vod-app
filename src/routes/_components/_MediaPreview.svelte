<script>
    import { onMount } from 'svelte';
    import { Media, MediaContent } from '@smui/card';
    import Textfield from '@smui/textfield';
    import { Preview } from '@vime-js/preview';
    import { getExt } from 'utils.js';
    
    export let media = {};
    export let src = null;
    export let poster = `https://via.placeholder.com/320x180.png?text=`;
    export let headline = 'A headline';
    export let subtitle = 'A subtitle';
    export let title = '';
    export let description = '';
    export let edit = false;


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
    .text-wrapper {
        position: absolute;
        bottom: 16px;
        left: 16px;
        z-index: 2;
    }
    .text-wrapper h2, .text-wrapper h3 {
        color: var(--text-light);
    }
    .editor > :global(*:not(:last-child)) {
        margin-bottom: 10px;
    }
    .edit {
        display: none;
    }


</style>
<Media aspectRatio="16x9">
    <MediaContent style="z-index: 0;">
        <div class="text-wrapper">
            <div class="" class:edit ={edit}>
                <h2 class="mdc-typography--headline6" style="margin: 0;">{media.title || headline}</h2>
                <h3 class="mdc-typography--subtitle2" style="margin: 0;">{media.description || subtitle}</h3>
            </div>
            <div class="editor" class:edit ={!edit}>
                <Textfield variant="outlined" dense bind:value={title} label="Title" input$aria-controls="helper-text-title" input$aria-describedby="helper-text-title" />
                <Textfield variant="outlined" dense bind:value={description} label="Description" input$aria-controls="helper-text-description" input$aria-describedby="helper-text-description" />
            </div>
        </div>
        <div class:edit >
            <Preview bind:this={preview} {poster}/>
        </div>
    </MediaContent>
</Media>