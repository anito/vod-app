<script>
	import {
		VimePlayer,
		VimeVideo, 
		VimeDefaultUi,
		usePlayerStore,
	} from '@vime/svelte';

	// Custom UI component.
	import TapSidesToSeek from './TapSidesToSeek.svelte';

	// Obtain a ref if you need to call any methods.
    let player = null;

    export let poster = '';
    export let src = '';
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
	<VimePlayer
		on:vPlaybackReady={onPlaybackReady}
		bind:this={player}
	>
		<VimeVideo cross-origin="true" {poster}>
			<source data-src={src} type="video/{type}">
		</VimeVideo>

		<VimeDefaultUi>
			<!-- Custom UI component. -->
			<TapSidesToSeek />
		</VimeDefaultUi>
	</VimePlayer>
</div>

<style>

	#container {
		width: 100%;
		max-width: 960px;
	}
</style>