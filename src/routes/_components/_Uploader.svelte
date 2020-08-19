<script>
	import { goto, stores } from '@sapper/app';
	import { onMount, createEventDispatcher, getContext } from 'svelte';
	import ListErrors from '../_components/ListErrors.svelte';
	import PreviewTemplate from '../_components/_PreviewTemplate.svelte';
    import Button, {Label, Icon} from '@smui/button';
	import { post } from 'utils.js';
	import { base } from 'api.js';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { Dropzone } from "@sveltejs/site-kit";

	export {className as class};
	export let path;
	export let acceptedFiles;
	export let paramName = 'Files';
	export let uploadMultiple = false;
	export let parallelUploads = 2;
	export let maxFiles = 2;

	const { close } = getContext('simple-modal');
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
	let count = 0;

	$: hasFiles = !!count;

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
		this.on( "success", ( e, res ) => {
			dispatch('Uploader:success', res);
		} )
		this.on( "addedfile", ( file ) => {
			++count;
			dispatch('Uploader:addedfile', file);
		} )
		this.on( "removedfile", ( file ) => {
			--count;
			dispatch('Uploader:removedfile', file);
		} )
		this.on( "totaluploadprogress", ( val ) => {
			dispatch('Uploader:totaluploadprogress', val);
			progress = val;
		} )
		this.on( "complete", ( file ) => {
			dropzone.removeFile(file);
			close();
		} )
		this.on( "maxfilesreached", ( files ) => {
			console.log(files);
		} )
	}

	onMount( async () => {
		options = {
			url: `${base}/${path}/?token=${$session.user.token}`,
			timeout: 3600 * 1000,
			uploadMultiple,
			maxFiles,
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
	} )

</script>

<style>

	.content {
		margin-bottom: 1rem;
	}
	.content .content-inner {
		z-index: 6;
		position: relative;
	}
	.dz-message {
		z-index: -1;
		position: relative;
	}
	.hasFiles {
		display: none;
	}
	.files-table {
		position: absolute;
		top: 0;
		width: 100%;
		height: auto;
		display: flex;
		flex-flow: row wrap;
		justify-content: start;
		align-items: start;
	}
	:global( .dropzone) {
		width: 100%;
	}
	:global(.btn-upload) {
		margin-top: 1rem;
	}

</style>

<div class="content {className}" bind:this={component}>
	<div class="content-inner relative">
		<form on:submit|preventDefault={submit} enctype="multipart/form-data" method="post">
			<Dropzone bind:this={dropzone}
				dropzoneClass="dropzone"
				hoveringClass="hoveringClass"
				id="drop-zone"
				dropzoneEvents={{ init }}
				{ options }
			>
				<p class:hasFiles class="fileAdded dz-message">Drop your file(s) here or click to add file</p>
			</Dropzone>
			<div use:html class="files-table files" bind:this={preview}>
				<PreviewTemplate/>
			</div>
			<Button disabled={!hasFiles} variant="raised" color="primary" class="w-full btn-upload">
				<Label>Upload</Label>
				<Icon class="material-icons">cloud_upload</Icon>
			</Button>
		</form>
	</div>
</div>