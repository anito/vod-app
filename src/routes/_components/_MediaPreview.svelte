<script>
    import { onMount } from 'svelte';
    import { Media, MediaContent } from '@smui/card';
    import Textfield, {Textarea} from '@smui/textfield';
    import VimePlayer from './_VimePlayer.svelte';
    import { Preview } from '@vime-js/preview';
    import { getExt, getImage, getVideo } from 'utils.js';
    import { crud } from '../../stores/crudStore.js';
    import { videos } from '../../stores/videoStore.js';
    
    const posterUrl = `https://via.placeholder.com/320x180.png?text=`;

    export let media = {};
    export let headline = 'A headline';
    export let subtitle = 'A subtitle';
    export let title = '';
    export let description = '';
    export let activeEditor = false;
    export let user;
    export let isHardcoded;

    const hardcoded = {
        poster: "agent_327.png",
        src: "agent_327.mp4",
    }

    let type = getExt(media.src);
    const defaultPoster = `${posterUrl}${type}`;
    let preview;
    let player;
    let poster;
    let src;
    


    async function getPosterSrc(id) {

        if(media.hardcoded) {
            poster = hardcoded.poster;
            return;
        }
        if(!id) {
            poster = defaultPoster;   
            return;
        }
		let res = await getImage(id, user, {width:300, height:300, square: 0});
        if(res)  poster = res;
    }
    
    async function getVideoSrc(id) {
        if(media.hardcoded) {
            src = hardcoded.src;
            return;
        }
        let res = await getVideo(id, user, {square: 2});
		if(res)  {
            src = res;
        }
    }

    getPosterSrc(media.image_id)
    getVideoSrc(media.id)

    crud.subscribe(item => {
        item.data &&
        item.data.id === media.id &&
        getPosterSrc(media.image_id);
    })

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
    .editor-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        background: rgba(255, 255, 255, .9);
    }
    .editor {
        display: flex;
        flex-direction: column;
        margin: 5px;
    }
    .editor > :global(*) {
        margin-bottom: 4px;
    }
    .preview-wrapper {
        position: relative;
        z-index: 0;
    }


</style>
<Media aspectRatio="16x9">
    <MediaContent style="z-index: 0;">
        <div class="text-wrapper hidden" class:activeEditor>
            <h2 class="mdc-typography--headline6" style="margin: 0;">{media.title || headline}</h2>
            <h3 class="mdc-typography--subtitle2" style="margin: 0;">{media.description || subtitle}</h3>
        </div>
        <div class="editor-wrapper" class:activeEditor={!activeEditor}>
            <div class="editor">
                <Textfield variant="outlined" dense bind:value={title} label="Title" input$aria-controls="helper-text-title" input$aria-describedby="helper-text-title" />
                <Textfield textarea variant="outlined" bind:value={description} label="Description" input$aria-controls="helper-text-description" input$aria-describedby="helper-text-description" />
            </div>
        </div>
        <div class="preview-wrapper">
            <VimePlayer
                bind:this={player}
                bind:poster={poster}
                bind:src={src}
                {type}
            />
        </div>
    </MediaContent>
</Media>