<script>
	import {tick} from 'svelte';
	import Ui from './Ui.svelte';

	let time = 0;
	let duration;
    let showControlsTimeout;
    let className = '';
    let hydrated = false;
	let currentPoster;
	let buffered;
	let showControls;
	let playPromise;
	let _src;
	let allowScrubbing = false;
	let scrubbing;
	let target;

	const showControlsLivespan = 2000;

    export let video;
	export let src;
	export let poster;
	export let type;
	export let paused = false;
	export let controls = true;
	export let preload = 'auto';
    export {className as class};

	$: ((p) => {
		if(currentPoster !== p) {
			currentPoster = p;
			reset();
		}
	})(poster)
	$: showControls = paused;
	$: if(paused) clearTimeout(showControlsTimeout);

	function handleMouseenter(e) {
		e = e.detail;
		showControls = true;
	}
	
	function handleMouseleave(e) {
		e = e.detail;
		showMediaControls();
	}

	function showMediaControls() {
		clearTimeout(showControlsTimeout);
		showControlsTimeout = setTimeout(() => showControls = false, showControlsLivespan);
		showControls = true;
	}

	function handleMousemove(e) {
		e = e.detail;
		showMediaControls();
		allowScrubbing && handleScrubbing(e);
		
	}

	function handleClearTimeout(e) {
		clearTimeout(showControlsTimeout);
	}

	function handleScrubbing(e) {
		if (!(e.buttons & 1)) return; // mouse not down
		if (!duration) return; // video not loaded yet

		const { left, right } = video && video.getBoundingClientRect();
		if(left === undefined || right === undefined) return;

		time = duration * (e.clientX - left) / (right - left);
		scrubbing = true;
	}

	function handlePlayPause() {
		!hydrated && !playPromise && video.load();
		if(paused) {
			playPromise = video.play();
			if(playPromise) playPromise.then(_=>{playPromise = null}).catch(_=>{})
		}
		else !playPromise && video.pause();
	}
	function handleRewind(e) {
		let step = e.detail || 15;
		let s;
		time -= ((s = (time - step)) < 0) ? step + s : step;
	}
	function handleForeward(e) {
		let step = e.detail || 15;
		time += (time + step) > duration ? duration - time : step;
	}

	function handleMousedown(e) {
		e = e.detail;
		target = e.currentTarget;

		// we can't rely on the built-in click event, because it fires
		// after a drag — we have to listen for clicks ourselves
        
		function handleMouseup() {
			_src && (src = _src);
			handlePlayPause();
			cancel();
		}

		function handleMouseupAfterDrag() {
			scrubbing = false;
			cancelAfterDrag();
		}

		function cancel() {
			target.removeEventListener('mouseup', handleMouseup);
			target.addEventListener('mouseup', handleMouseupAfterDrag);
			target.addEventListener('mouseleave', handleMouseupAfterDrag);
		}
		
		function cancelAfterDrag() {
			target.removeEventListener('mouseup', handleMouseupAfterDrag);
			target.removeEventListener('mouseleave', handleMouseupAfterDrag);
		}

		target.addEventListener('mouseup', handleMouseup);

		setTimeout(cancel, 100); // prevent start/stop after scrubbing
    }
    
    function handleCanplay(e) {
        console.log('canplay', e)
    }

    function handleLoadedData(e) {
        hydrated = true;
        video.play();
	}
	
    function handleEmptied(e) {
        hydrated = false;
	}
	
    function handlePictureInPicture(e) {
		if (document.pictureInPictureElement)
			document
			.exitPictureInPicture()
			.catch(e => {})
		else video && video.requestPictureInPicture()
			.catch(e => {})
	}

    function handleFullscreen(e) {
        if (document.fullscreenElement)
			document.exitFullscreen()
			.catch(e => {})
		else if(video && video.requestFullscreen) video.requestFullscreen()
		else if(video && video.webkitRequestFullScreen) video.webkitRequestFullScreen()
	}
	
	async function reset() {
		if(!hydrated) return;
		video.pause();
		_src = src;
		src = '';
		await tick();
		video.load();
	}

</script>

<div class="player {className}" class:hydrated>
	<video
		{poster}
		{preload}
		{controls}
        {type}
		on:loadeddata={handleLoadedData}
		on:emptied={handleEmptied}
		bind:currentTime={time}
		bind:duration
		bind:paused
		bind:buffered
        bind:this={video}
        x-webkit-airplay='allow'
	>
        <source {src} type="video/{type}"/>
        <track kind="captions">
        Your browser does not support the
        <code>video</code>
        element.
    </video>
	<Ui
		on:mousemove={handleMousemove}
		on:mousedown={handleMousedown}
		on:mouseenter={handleMouseenter}
		on:mouseleave={handleMouseleave}
		on:clearTimeout={handleClearTimeout}
		on:fullscreen={handleFullscreen}
		on:play-pause={handlePlayPause}
		on:rwd={handleRewind}
		on:fwd={handleForeward}
		on:pip={handlePictureInPicture}
		bind:time
		{duration}
		{showControls}
		{paused}
		{buffered}
	/>
	
</div>

<style>
	.player {
        position: relative;
        user-select: none;
	}

	video {
		width: 100%;
		min-width: var(--player-min-w);
        object-position: center;
        object-fit: cover;
    }
    
    .hydrated video {
        object-fit: contain;
    }

</style>