<script>
	import * as api from 'api.js';
	import { goto, stores } from '@sapper/app';
	import { onMount, getContext, createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { images } from '../../stores/imageStore';
	import { urls } from '../../stores/urlStore';
	import { cache, cachedImage } from 'utils.js';

	import MediaPreview from './_MediaPreview.svelte';
	import ImageUploader from './_ImageUploader.svelte';
	import Card, {Content, PrimaryAction, Actions, ActionButtons, ActionIcons} from '@smui/card';
	import Button, {Label} from '@smui/button';
	import IconButton, {Icon} from '@smui/icon-button';
	import Menu from '@smui/menu';
	import List, {Item, Separator, Text, PrimaryText, SecondaryText, Graphic} from '@smui/list';

	export let image;
	export let user;

	let token = user.token;
	let menuPoster;
	let dispatch = createEventDispatcher();
	let src;

	const { open } = getContext('simple-modal');

	async function remove( id ) {

		const result = await api.del( `images/${id}`, user && user.token )

		if( result.success ) {
			urls.del(id)
			// at this point associated videos are not updated yet
			// however we fetch a fresh set on preload when changing to video page
			images.del(id)
		}
	}

	function createPoster(e) {
		open( ImageUploader, {}, {
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

	async function uri(image) {
		var id= image.id;
		var w = 300;
		var h = 300;
		var sq = 0;
		var query = `?width=${w}&height=${h}&square=${sq}`;
		
		const result = await api.get( `u/i/${id}/${query}`, user && user.token );
		if(result.success) {
			urls.add( result.data );
			return `${result.data[id]}/?token=${user.token}`;
		}
		return
	}
</script>

<style>


</style>

<Card style="width: 260px;" class="flex content-between">
	<PrimaryAction on:click={() => uri(image)}>
			{#await cachedImage(image.id, user, {})}
				<MediaPreview media={{}}/>
			{:then src}
				<MediaPreview media={image} {src}/>
			{/await}
		<Content class="mdc-typography--body2">
			<div>{image.src}</div>
		</Content>
	</PrimaryAction>
	<div class="flex flex-col justify-end" style="flex:1 0 auto">
		<Actions>
			<ActionButtons>
				<Button on:click={()=>remove(image.id)}>
					<Label>Delete</Label>
				</Button>
			</ActionButtons>
			<ActionIcons style="position: relative;">
				<IconButton class="material-icons" on:click={() => menuPoster.setOpen(true)} toggle aria-label="Add to favorites" title="Add to favorites">
					more_vert
				</IconButton>
				<Menu bind:this={menuPoster}>
					<List>
						<Item on:click={() => createPoster()}><Text>New Poster</Text></Item>
						<Item on:SMUI:action={() => selectPoster(image.id)}><Text>Select Poster</Text></Item>
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