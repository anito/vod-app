<script>
	import * as api from 'api.js';
	import { goto, stores } from '@sapper/app';
	import { get } from 'svelte/store';
	import { onMount, onDestroy, getContext, createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { videos } from '../../stores/videoStore';
	import { urls } from '../../stores/urlStore';
	import { crud } from '../../stores/crudStore';
	import { getImage } from 'utils.js';

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
	let deleteMenu;
	let dispatch = createEventDispatcher();
	let src;
	let imageList;
	let imageListAnchor;
	let activeEditor = false;
	let title;
	let description;
	let editing;
	const labelEdit = 'edit';
	const labelSave = 'save';
	const labelDelete = 'delete';
	const labelCancel = 'cancel';
	let labelMode_1;
	let labelMode_2;
	let dateOptions = {
		weekday: 'long',
		year: 'numeric',
		month: '2-digit',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	}

	$: mode_1 = activeEditor ? 'Save' : 'Edit';
	$: mode_2 = activeEditor ? 'Cancel' : 'Delete';
	$: labelMode_1 = activeEditor ? labelSave : labelEdit;
	$: labelMode_2 = activeEditor ? labelCancel : labelDelete;

	onDestroy(() => {
		dispatch('Video:current', null);
	})
	
	function save() {
		if(description !== video.description || title !== video.title) {
			video.title = title;
			video.description = description;
			crud.dispatch({
				method: 'put',
				data: video
			})
		};
	}
	function edit() {
		title = video.title || '';
		description = video.description || '';
		return true;
	}
	function setDeleteMenuOpen(b) {
		deleteMenu.setOpen(b)
		return false;
	}
	async function del() {

		let id = video.id;
		const result = await api.del( `videos/${id}`, user && user.token )

		if( result.success ) {
			urls.del(id)
			videos.del( id )
		}
	}

	function selectPoster(id) {
		video.image_id = id;
		crud.dispatch({
			method: 'put',
			data: video
		})
	}

	function removePoster() {
		video.image_id = null;
		crud.dispatch({
			method: 'put',
			data: video
		})
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

	async function getCachedImage(id) {
		let res = await getImage(id, user, {width:100, height:100, square: 1});
		return res;
	}
	async function getVideoPreview(id) {
		if(!id) return false;
		let res = await getImage(id, user, {width:300, height:300, square: 0});
		return res;
	}
</script>

<style>

	:global(.preview-image) {
		cursor: pointer;
	}
	.text-inherit > :global(*) {
		font-size: inherit;
	}
    :global(.activeEditor) {
        display: none;
    }

</style>

	<Card style="width: 260px;" class="flex content-between">
		<PrimaryAction on:click={() => !activeEditor && goto(`/videos/${video.id}`)}>
			{#await getVideoPreview(video.image_id)}
				<MediaPreview
					media={video}
				/>
			{:then src}
				<MediaPreview
					media={video}
					bind:title={title}
					bind:description={description}
					{src}
					{activeEditor}
				/>
			{/await}
			<Content class="mdc-typography--body2">
				<div class="text-xs text-inherit">
					<Icon class="material-icons">cloud_upload</Icon>
					<span>{new Date(video.created).toLocaleDateString('de-DE', dateOptions)}</span>
				</div>
			</Content>
		</PrimaryAction>
		<div class="flex flex-col justify-end" style="flex:1 0 auto">
			<Actions>
				<ActionButtons>
					<Button color="primary" on:click={() => (activeEditor=!activeEditor && edit()) || save()}>
						<Label>{mode_1}</Label>
						<Icon class="material-icons">{labelMode_1}</Icon>
					</Button>
					<Button color="primary" on:click={() => (activeEditor=!activeEditor && setDeleteMenuOpen(true))}>
						<Label>{mode_2}</Label>
						<Icon class="material-icons">{labelMode_2}</Icon>
					</Button>
				</ActionButtons>
				<ActionIcons style="position: relative;">
					<IconButton class="material-icons" on:click={() => cardMenu.setOpen(true)} toggle aria-label="Add to favorites" title="Add to favorites">
						more_vert
					</IconButton>
					<Menu bind:this={cardMenu}>
						<List>
							<Item on:click={() => createPoster()}><Text>New Poster</Text></Item>
							<Item disabled={!$images.length} on:click={() => imageList.setOpen(true)}><Text>Select Poster</Text></Item>
							<Separator />
							<Item disabled={!video.image_id} on:SMUI:action={() => removePoster()}><Text>Remove Poster</Text></Item>
							<Item class="text-red-700" on:SMUI:action={() => del()}><Text>Delete Video</Text></Item>
						</List>
					</Menu>
					<Menu bind:this={deleteMenu}>
						<List>
							<Item class="text-red-700" on:SMUI:action={() => del()}><Text>Delete Video</Text></Item>
						</List>
					</Menu>
					<div use:Anchor bind:this={imageListAnchor}>
						<MenuSurface bind:this={imageList} anchor={false} bind:anchorElement={imageListAnchor}>
							<ImageList class="menu-surface-image-list">
								{#each $images as image, i (image.id)}
								{#await getCachedImage(image.id)}
									<div></div>
								{:then src}
									<ImageListItem>
										<ImageAspectContainer>
											<Image class="preview-image" on:click={()=>selectPoster(image.id)} {src}/>
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
