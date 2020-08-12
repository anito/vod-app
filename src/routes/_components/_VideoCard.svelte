<script>
	import * as api from 'api.js';
	import { goto, stores } from '@sapper/app';
	import { onMount, getContext, createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { videos } from '../../stores/videoStore';
	import { urls } from '../../stores/urlStore';

	import MediaPreview from './_MediaPreview.svelte';
	import VideoUploader from './_ImageUploader.svelte';
	import Card, {Content, PrimaryAction, Actions, ActionButtons, ActionIcons} from '@smui/card';
	import Button, {Label} from '@smui/button';
	import IconButton, {Icon} from '@smui/icon-button';
	import Menu from '@smui/menu';
	import List, {Item, Separator, Text, PrimaryText, SecondaryText, Graphic} from '@smui/list';

	export let video;
	export let user;

	let token = user.token;
	let menuPoster;
	let isopen = false;
	let dispatch = createEventDispatcher();

	$: if(isopen) {
		dispatch('Video:lastSelected', video);
	}
	const { open } = getContext('simple-modal');

	async function remove( id ) {

		const result = await api.del( `videos/${id}`, user && user.token )

		if( result.success ) {
			videos.del( id )
		}
	}

	function createPoster(e) {
		open( VideoUploader, {}, {
            transitionWindow: fly,
			transitionWindowProps: {
				y: -200,
				duration: 500
			},
        } )
	}

	function selectPoster( id ) {
		alert( `Selecting Poster for : ${id}` )
	}

	function deletePoster( action ) {
		alert( `Youd did an action: ${action}` )
	}

	function doAction( action ) {
		alert( `Youd did an action: ${action}` )
	}

	async function uri(video) {
		// posters in preview component are images, so we don't handle video uri here 
		if(!video.image_id) return

		var id= video.image_id;
		var w = 300;
		var h = 300;
		var sq = 0;
		var query = `?width=${w}&height=${h}&square=${sq}`;
		var type = 'i';
		// const result = await api.get( `u/${id}/?width=${w}&height=${h}&square=${sq}`, user && user.token );
		const result = await api.get( `u/${type}/${id}/${query}`, user && user.token );
		if(result.success) {
			urls.add( result.data );
			return `${result.data.url}/?token=${user.token}`;
		}
		return ''
	}
</script>

<style>


</style>

<Card style="width: 260px;" class="flex content-between">
	<PrimaryAction on:click={() => uri(video.id)}>
		{#await video.image_id && uri(video)}
		<MediaPreview media={video}/>
		{:then src}
		<MediaPreview media={video} {src}/>
		{/await}
		<Content class="mdc-typography--body2">
			<div>{video.src}</div>
		</Content>
	</PrimaryAction>
	<div class="flex flex-col justify-end" style="flex:1 0 auto">
		<Actions>
			<ActionButtons>
				<Button on:click={() => {} }>
					<Label>Url</Label>
				</Button>
				<Button on:click={()=>remove(video.id)}>
					<Label>Delete</Label>
				</Button>
			</ActionButtons>
			<ActionIcons style="position: relative;">
				<IconButton class="material-icons" on:click={() => menuPoster.setOpen(true)} toggle aria-label="Add to favorites" title="Add to favorites">
					more_vert
				</IconButton>
				<Menu bind:open={isopen} bind:this={menuPoster}>
					<List>
						<Item on:click={() => createPoster()}><Text>New Poster</Text></Item>
						<Item on:SMUI:action={() => selectPoster(video.id)}><Text>Select Poster</Text></Item>
						<Separator />
						<Item on:SMUI:action={() => deletePoster()}><Text>Delete Poster</Text></Item>
					</List>
				</Menu>
				<IconButton class="material-icons" on:click={() => doAction('share')} title="Share">
					share
				</IconButton>
			</ActionIcons>
		</Actions>
	</div>
</Card>