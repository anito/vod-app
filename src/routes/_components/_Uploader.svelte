<script>
	import { goto, stores } from '@sapper/app';
	import { onMount, createEventDispatcher } from 'svelte';
	import ListErrors from '../_components/ListErrors.svelte';
	import PreviewTemplate from '../_components/_PreviewTemplate_.svelte';
	import { post } from 'utils.js';
	import { base } from 'api.js';

	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { Dropzone } from "@sveltejs/site-kit";

	export {className as class};
	export let path;
	export let acceptedFiles;
	export let paramName = 'Files';
	export let parallelUploads = 2;

	const dispatch = createEventDispatcher()
	const addedfile = file => console.log(file);
	const drop = event => console.log(event.target);
	const { session } = stores();

	let component;
	let dropzone;
	let className = '';
	let filename = '';
	let description = '';
	let progress = 0;
	let preview;
	let template;
	let options;

	let html = ( el ) => {
		let child = el.childNodes[0];
		template = el.removeChild( child ).outerHTML;
	}

	let submit = function(e) {
		e.preventDefault();
		dropzone.processQueue();

	}
	let init = function() {
		dropzone = this;

		// Events
		this.on( "successmultiple", ( e, res ) => {
			dispatch('Uploader:successmultiple', res);
		} )
		this.on( "addedfile", ( file ) => {
			dispatch('Uploader:addedfile', file);
		} )
		this.on( "totaluploadprogress", ( val ) => {
			dispatch('Uploader:totaluploadprogress', val);
			progress = val;
		} )
		this.on( "complete", ( file ) => {
			dropzone.removeFile(file);
		} )
	}

	onMount( async () => {
		options = {
			url: `${base}/${path}/?token=${$session.user.token}`,
			uploadMultiple: true,
			paramName,
			autoProcessQueue: false,
			parallelUploads,
			withCredentials: true,
			thumbnailWidth: 80,
			thumbnailHeight: 80,
			clickable: true,
			acceptedFiles: acceptedFiles.join(' '),
			maxFilesize: 256,
			previewsContainer: preview,
			previewTemplate: template,
			init
		}
		console.log(options)
	} )

</script>

<style>

	.content .content-inner {
		z-index: 6;
		position: relative;
	}

	:global( .dropzone) {
		width: 100%;
	}

</style>

<div class="content {className}" bind:this={component}>
	<div class="content-inner">
		<form on:submit|preventDefault={submit} enctype="multipart/form-data" method="post">
			<Dropzone bind:this={dropzone}
				dropzoneClass="dropzone"
				hoveringClass="hoveringClass"
				id="drop-zone"
				dropzoneEvents={{ init }}
				{ options }
			>
				<p>Drop files</p>
			</Dropzone>
			<div use:html class="table table-striped files" bind:this={preview}>
				<PreviewTemplate/>
			</div>
		</form>
	</div>
</div>