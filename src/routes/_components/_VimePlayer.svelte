<script>
	import { usePlayerStore } from '@vime/svelte';

	// Custom UI component.
	import TapSidesToSeek from './TapSidesToSeek.svelte';

	// Obtain a ref if you need to call any methods.
    let player = null;

    export let poster;
    export let src;
    export let type;

	/**
	 * All player properties are available through the store. If you prefer, you could also pass 
	 * properties directly to the player and listen for events.
	 */
	const { paused } = usePlayerStore(() => player);

	const onPlaybackReady = () => {
		// ...
	};

    $: console.log('paused:', $paused);
    $: console.log('poster-src:', poster)
    $: console.log('video-src:', src)
</script>

<div id="container">
	<vime-player
		on:vPlaybackReady={onPlaybackReady}
		bind:this={player}
	>
		<vime-video cross-origin="true" {poster}>
			<source {src} type="video/{type}">
		</vime-video>

		<vime-default-ui>
			<!-- Custom UI component. -->
			<TapSidesToSeek />
		</vime-default-ui>
	</vime-player>
</div>

<style>
	:global(html),
	:global(body) {
		width: 100%;
		height: 100%;
	}

	:global(body) {
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#container {
		width: 100%;
		max-width: 960px;
	}
</style>