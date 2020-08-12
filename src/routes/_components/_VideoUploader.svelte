<script>
	import { videos } from '../../stores/videoStore';
	import Uploader from './_Uploader.svelte';
	import { Header } from '@sveltejs/site-kit';

	let component;
	let className = '';
	let acceptedFiles = ['video/*'];
	let paramName = 'Video';
	let parallelUploads = 20;
	let path = 'videos';

	export {className as class};

	function onSuccessmultiple(e) {
		videos.add(e.detail.data)
	}
	
</script>

<style>


</style>

<div class="uploader-wrapper {className}" bind:this={component}>
	<Header h=5 mdc>Video Uploader</Header>
	<Uploader on:Uploader:successmultiple={onSuccessmultiple} {acceptedFiles} {paramName} {path} {parallelUploads}/>
</div>