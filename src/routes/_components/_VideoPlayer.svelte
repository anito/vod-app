<script>
	import {
		VimePlayer,
		VimeVideo, 
		VimeDefaultUi,
		usePlayerStore,
	} from '@vime/svelte';
	import {onMount} from 'svelte';

	// Custom UI component.
	import TapSidesToSeek from './TapSidesToSeek.svelte';

	// Obtain a ref if you need to call any methods.
    let player;

    export let poster;
    export let src;
	export let type;

	onMount(() => {
		// console.log(player)
		// console.log(poster)
		// console.log(src)
	})

	/**
	 * All player properties are available through the store. If you prefer, you could also pass 
	 * properties directly to the player and listen for events.
	 */
	const { paused, language, languages, translations,  } = usePlayerStore(() => player);

	translations.subscribe((items) => {
		// console.log(items)
	})

	$: console.log($translations)

	const onPlaybackReady = () => {
		// console.log('playback ready')
	};
	const onDestroyed = () => {
		console.log('Player destroyed')
	};

	$: console.log('language', language);
	$: console.log('languages', languages);
    $: console.log('paused:', $paused);
    $: console.log('poster-src:', poster)
    $: console.log('video-src:', src)
</script>

<VimePlayer
	on:vPlaybackReady={onPlaybackReady}
	on:vDestroyed={onDestroyed}
	bind:this={player}
	debug
>
	<VimeVideo cross-origin="true" {poster}>
		<source data-src={src} type="video/{type}">
	</VimeVideo>

	<VimeDefaultUi>
		<!-- Custom UI component. -->
		<TapSidesToSeek />
	</VimeDefaultUi>
</VimePlayer>

<style>

	:global(vime-player) {
		min-width: var(--player-min-w);
	}
</style>