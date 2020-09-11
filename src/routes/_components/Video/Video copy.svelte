<script>
    import {onMount, createEventDispatcher} from 'svelte';

    export let autoplay = false;
    export let aspectRatio = '16:9';
    export let controls = false;
    export let muted = false;
    export let poster;
    export let preload = 'metadata';
    export let duration;
    export let paused;
    export let src;
    export let video;

    // let currentTime;
    let time = 0;
    let showControlsTimeout;
    let dispatch;

    dispatch = createEventDispatcher();

    onMount(() => {
        window.ref = video
        // time = video && video.currentTime;

    })

    $: console.log('V', paused)
    $: console.log('time', time)
    $: [w, h] = aspectRatio.split(':');
    $: width = '100%';
</script>

<style>
    video {
        object-fit: cover;
    }

</style>

<h4 class="absolute m-2">{time}</h4>
<video
    bind:this={video}
    bind:duration
    bind:paused
    bind:currentTime={time}
    {autoplay}
    {controls}
    {poster}
    {preload}
    {width}
    {muted}
    {src}
    x-webkit-airplay='allow'
>   
    Your browser does not support the
    <code>video</code>
    element.
</video>