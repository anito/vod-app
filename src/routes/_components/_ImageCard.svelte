<script>
	import * as api from 'api.js';
	import { goto, stores } from '@sapper/app';
	import { onMount, getContext, createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { images } from '../../stores/imageStore';
	import { urls } from '../../stores/urlStore';
	import { getImage } from 'utils.js';

	import MediaImagePreview from './_MediaImagePreview.svelte';
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

	async function deletePoster() {
		const id = image.id;
		const result = await api.del( `images/${id}`, user && user.token )

		if( result.success ) {
			urls.del(id)
			// at this point associated videos are not updated yet
			// however we fetch a fresh set on preload when changing to video page
			images.del(id)
		}
	}
</script>

<style>


</style>

<Card style="width: 260px;" class="flex content-between">
	<PrimaryAction>
		<MediaImagePreview
			media={image}
			{user}
		/>
	</PrimaryAction>
	<div class="flex flex-col justify-end" style="flex:1 0 auto">
		<Actions>
			<ActionButtons>
				<Button color="primary" on:click={()=>menuPoster.setOpen(true)}>
					<Label>Delete</Label>
					<Icon class="material-icons">delete</Icon>
				</Button>
			</ActionButtons>
			<ActionIcons style="position: relative;">
				<IconButton class="material-icons" on:click={() => menuPoster.setOpen(true)} toggle aria-label="Add to favorites" title="Add to favorites">
					more_vert
				</IconButton>
				<Menu bind:this={menuPoster}>
					<List>
						<Item class="text-red-700" on:SMUI:action={() => deletePoster()}><Text>Delete Poster</Text></Item>
					</List>
				</Menu>
			</ActionIcons>
		</Actions>
	</div>
</Card>