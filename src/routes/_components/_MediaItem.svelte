<script>
    import { onMount } from 'svelte';
    import { Media, MediaContent } from '@smui/card';
    import Textfield, {Textarea} from '@smui/textfield';
    import VideoPlayer from './_VideoPlayer.svelte';
    import { getExt, getImage, getVideo } from 'utils.js';
    import { crud } from '../../stores/crudStore.js';
    
    export let media = {};
    export let headline = '';
    export let subtitle = '';
    export let title = '';
    export let description = '';
    export let activeEditor = false;
    export let user;

    const hardcoded = {
        poster: "agent_327.png",
        src: "agent_327.mp4",
    }

    let type = getExt(media.src);
    let paused;
    let isPlaying;
    let poster;
    let src;

    $: isPlaying = !paused;

    async function getPosterUrl(id) {

        if(media.hardcoded) {
            poster = hardcoded.poster;
            return;
        }
        if(!id) {
            poster = null;   
            return;
        }
		let res = await getImage(id, user, {width:300, height:300, square: 0});
        if(res)  poster = res;
    }
    
    async function getVideoUrl(id) {
        if(media.hardcoded) {
            src = hardcoded.src;
            return;
        }
        let res = await getVideo(id, user, {square: 2});
		if(res)  {
            src = res;
        }
    }

    crud.subscribe(item => {
        item.data &&
        item.data.id === media.id &&
        getPosterUrl(media.image_id);
    })

    getPosterUrl(media.image_id)
    getVideoUrl(media.id)

    let onPaused = (e) => {
        isPlaying = !e.detail;
    }

    let onPosterChange = (e) => {
        console.log('Poster changed')
    }
</script>

<style>
    .text-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 70%;
        right: inherit;
        z-index: 2;
        transform: translateX(0);
        transform-origin: 0 center;
        transition-property: transform;
        transition-duration: .3s;
        transition-timing-function: ease-in-out;
    }
    .text-wrapper > * {
        color: var(--text-light);
        padding: 5px 17px;
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
    .player-container {
        position: relative;
        z-index: 0;
    }
    .isPlaying {
        opacity: 0;
        right: 2000px;
        transform: translate(100%);
        transform-origin: 100% center;
        transition-property: opacity, transform;
        transition-duration: 0.1s;
        transition-timing-function: ease-in-out;
    }


</style>
<Media aspectRatio="16x9">
    <MediaContent class="flex" style="display: flex; z-index: 0;">
        <div class="text-wrapper bg-gradient-to-b from-black" class:activeEditor class:isPlaying>
            <h2 class="mdc-typography--headline6" style="margin: 0;">{media.title || headline}</h2>
            <h3 class="mdc-typography--subtitle2" style="margin: 0;">{media.description || subtitle}</h3>
        </div>
        <div class="editor-wrapper" class:activeEditor={!activeEditor}>
            <div class="editor">
                <Textfield variant="outlined" dense bind:value={title} label="Title" input$aria-controls="helper-text-title" input$aria-describedby="helper-text-title" />
                <Textfield textarea variant="outlined" bind:value={description} label="Description" input$aria-controls="helper-text-description" input$aria-describedby="helper-text-description" />
            </div>
        </div>
        <div class="player-container flex flex-1 bg-black">
            <VideoPlayer class="video-player flex"
                bind:paused
                {poster}
                {src}
                {type}
            />
        </div>
    </MediaContent>
</Media>