<script>
	import * as api from 'api.js';
	import { goto, stores } from '@sapper/app';
	import { get } from 'svelte/store';
	import { onMount, onDestroy, getContext, createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { videos } from '../../stores/videoStore';
	import { urls } from '../../stores/urlStore';
	import { crud } from '../../stores/crudStore';
	import { cache, cachedImage } from 'utils.js';

	import MediaPreview from './_MediaPreview.svelte';
	import VideoUploader from './_ImageUploader.svelte';
	import Card, {Content, PrimaryAction, Actions, ActionButtons, ActionIcons} from '@smui/card';
	import Button, {Label} from '@smui/button';
	import IconButton, {Icon} from '@smui/icon-button';
	import Menu from '@smui/menu';
	import MenuSurface, {Anchor} from '@smui/menu-surface';
	import ImageList, {Item as ImageListItem, ImageAspectContainer, Image} from '@smui/image-list';
	import List, {Item, Separator, Text, PrimaryText, SecondaryText, Graphic} from '@smui/list';
	import './menu-surface.scss';

	export let video;
	export let user;
	export let images;

	const { open } = getContext('simple-modal');

	let image;
	let token = user.token;
	let cardMenu;
	let dispatch = createEventDispatcher();
	let src;
	let imageList;
	let imageListAnchor;

	onDestroy(() => {
		dispatch('Video:current', null);
	})
	
	async function del() {

		let id = video.id;
		const result = await api.del( `videos/${id}`, user && user.token )

		if( result.success ) {
			urls.del(id)
			videos.del( id )
		}
	}

	function createPoster(e) {

		dispatch('Video:current', video);

		open( VideoUploader, {}, {
            transitionWindow: fly,
			transitionWindowProps: {
				y: -200,
				duration: 500
			},
        } )
	}

	function selectPoster() {
		alert( `Selecting Poster for : ${video.id}` )
	}

	function removePoster() {
		video.image_id = null;
		crud.dispatch({
			method: 'put',
			data: video
		})
	}

	function doAction( action ) {
		alert( `Youd did an action: ${action}` )
	}

	async function uri(video) {
		// posters in preview component are images, so we don't handle video uri here 
		// get the poster image for the video if we have one
		if(!video.image_id) return

		var id= video.image_id;
		var w = 300;
		var h = 300;
		var sq = 0;
		var query = `?width=${w}&height=${h}&square=${sq}`;
		// const result = await api.get( `u/${id}/?width=${w}&height=${h}&square=${sq}`, user && user.token );
		const result = await api.get( `u/i/${id}/${query}`, user && user.token );
		if(result.success) {
			urls.add( result.data );
			return `${result.data[id]}/?token=${user.token}`;
		}
		return ''
	}
	async function getCache(id) {
		let res = await cachedImage(id, user, {width:100, height:100, square: 1});
		return res;
	}
</script>

<style>


</style>

	<Card style="width: 260px;" class="flex content-between">
		<PrimaryAction on:click={() => uri(video)}>
			{#if src = cache(video.image_id, user)}
				<MediaPreview media={video} {src}/>
			{:else}
				{#await uri(video)}
					<MediaPreview media={video}/>
				{:then src}
					<MediaPreview media={video} {src}/>
				{/await}
			{/if}
			<Content class="mdc-typography--body2">
				<div>{video.src}</div>
			</Content>
		</PrimaryAction>
		<div class="flex flex-col justify-end" style="flex:1 0 auto">
			<Actions>
				<ActionButtons>
					<Button color="primary" class="">
						<Label>Edit</Label>
						<Icon class="material-icons">edit</Icon>
					</Button>
					<Button color="primary" class="" on:click={() => del()}>
						<Label>Delete</Label>
						<Icon class="material-icons">delete</Icon>
					</Button>
				</ActionButtons>
				<ActionIcons style="position: relative;">
					<IconButton class="material-icons" on:click={() => cardMenu.setOpen(true)} toggle aria-label="Add to favorites" title="Add to favorites">
						more_vert
					</IconButton>
					<Menu bind:this={cardMenu}>
						<List>
							<Item on:click={() => createPoster()}><Text>New Poster</Text></Item>
							<Item on:click={() => imageList.setOpen(true)}><Text>Select Poster</Text></Item>
							<Separator />
							<Item disabled={!video.image_id} on:SMUI:action={() => removePoster()}><Text>Delete Poster</Text></Item>
							<Item on:SMUI:action={() => del()}><Text>Delete</Text></Item>
						</List>
					</Menu>
					<div use:Anchor bind:this={imageListAnchor}>
						<MenuSurface bind:this={imageList} anchor={false} bind:anchorElement={imageListAnchor}>
							<ImageList class="menu-surface-image-list">
								{#each $images as image, i (image.id)}
								{#await getCache(image.id)}
									<div></div>
								{:then src}
								<ImageListItem>
									<ImageAspectContainer>
										<Image src="{src}" />
									</ImageAspectContainer>
								</ImageListItem>
								{/await}
								{/each}
							</ImageList>
						</MenuSurface>
					</div>
				</ActionIcons>
			</Actions>
		</div>
	</Card>
