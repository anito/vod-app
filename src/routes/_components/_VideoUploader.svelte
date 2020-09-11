<script>
	import { videos } from '../../stores/videoStore';
	import Uploader from './_Uploader.svelte';
	import { Header } from '@sveltejs/site-kit';

	let component;
	let className = '';
	let options = {
		acceptedFiles: 'video/*',
		// acceptedFiles: '.mov .mp4 .m4a .m4v .3gp .3g2 .webm',
		paramName: 'Video',
		uploadMultiple: true,
		parallelUploads: 20,
		maxFiles: 20,
		path: 'videos'
	}
	let count = 0;

	export {className as class};

	function onAddedfile(image) {
        ++count;
    }
    function onRemovedfile(image) {
        --count;
    }
	function onSuccess(e) {
        if(options['uploadMultiple']) return;
        let uploads = e.detail.data;
        handleUpload(uploads);
    }
    function onSuccessmultiple(e) {
        let uploads = e.detail.data;
        handleUpload(uploads);
    }
    function handleUpload(uploads) {
        let video;
        videos.add(uploads);
    }
	
</script>

<style>
	.subheader {
        font-size: .8rem;
    }

</style>

<div class="uploader-wrapper {className}" bind:this={component}>
	<Header h=5 mdc>
		Video Uploader
		<div class="subheader">
            <span>Queue:{count}</span>
            <span>Max:{options.maxFiles}</span>
        </div>
	</Header>
	<Uploader
		on:Uploader:successmultiple={onSuccessmultiple}
		on:Uploader:success={onSuccess}
        on:Uploader:addedfile={onAddedfile}
        on:Uploader:removedfile={onRemovedfile}
		{...options}
	/>
</div>