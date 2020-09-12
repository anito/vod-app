<script context="module">
	let players = new Set();
</script>

<script>
	import {Video} from '../_components/Video';
	import {onMount, createEventDispatcher} from 'svelte';

    export let poster;
    export let src;
    export let type;
	
	let video;
	let player;
	let controls = false;
	let showControls = true;
	let paused = true;
	let muted = false;
	let preload = 'none';
	let autoplay = false;
	let duration;
	let time = 0;
	let width = '100%';
	let className = '';
	let dispatch = createEventDispatcher();

	export {className as class};

	onMount(_ => {
		players.add(video)
	})

	$: ((playing) => {
		playing &&
		players.forEach(player => {
			(player !== video) &&
			(player.promise && player.promise.then(() => player.pause()))
		})
	})(!paused);
</script>

<Video class={className}
	bind:paused
	bind:video
	{poster}
	{preload}
	{src}
	{type}
	{controls}
	{showControls}
>
</Video>

<style>

</style>