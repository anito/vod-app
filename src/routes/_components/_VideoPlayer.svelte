<script>
	import {
		VimePlayer,
		VimeVideo, 
		VimeDefaultUi,
		usePlayerStore,
	} from '@vime/svelte';
	import {createEventDispatcher} from 'svelte';

	// Custom UI component.
	import TapSidesToSeek from './TapSidesToSeek.svelte';

	// Obtain a ref if you need to call any methods.
	let player;
	let dispatch = createEventDispatcher();

    export let poster;
    export let src;
	export let type;

	/**
	 * All player properties are available through the store. If you prefer, you could also pass 
	 * properties directly to the player and listen for events.
	 */
	const { paused, language, languages, translations, errors } = usePlayerStore(() => player);

	translations.subscribe((items) => {
		// console.log(items)
	})

	$: console.log('%cPlayer.language    : ', 'color: white; background: #229ed4; display: block; font-weight: bold', $language);
	$: console.log('%cPlayer.languages   : ', 'color: white; background: #229ed4; display: block; font-weight: bold', $languages);
	$: console.log('%cPlayer.translations: ', 'color: white; background: #229ed4; display: block; font-weight: bold', $translations);
	$: console.log('%cPlayer.errors      : ', 'color: white; background: #229ed4; display: block; font-weight: bold', $errors);

	const onPlaybackReady = () => {
		// console.log('playback ready')
	};
	const onDestroyed = () => {
		console.log('Player destroyed')
	};

</script>

<VimePlayer
	on:vPlaybackReady={onPlaybackReady}
	on:vDestroyed={onDestroyed}
	on:vPausedChange
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