<script>
    // import { usePlayerStore } from '@vime/svelte/dist/cjs';

    // export * from './components';
    export let poster = '';
    export let src = '';
    export let type;

    let player;

    function onPlaybackReady() {
        //
    }

</script>

<style>
    #container {
		width: 100%;
		max-width: 960px;
	}

</style>

<div id="container">
    <vime-player
        on:vPlaybackReady={onPlaybackReady}
        bind:this={player}
    >
        <vime-video cross-origin="true" {poster}>
            <source data-src={src} type="video/{type}">
        </vime-video>

        <vime-default-ui></vime-default-ui>
    </vime-player>
</div>