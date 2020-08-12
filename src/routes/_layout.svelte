<script>
	import { goto, stores } from '@sapper/app';
	import { onMount } from 'svelte';
	import { setContext } from 'svelte';
	import { Icon as SvelteIcon, Icons, Nav, NavItem } from '@sveltejs/site-kit';

	import Button from '@smui/button';
	import { Label } from '@smui/common';
	import Fab, { Icon } from '@smui/fab';
	import { post } from 'utils.js';
	import { GridItem, LayoutGrid } from '@sveltejs/site-kit';
	import Breadcrumb from './_components/_Breadcrumb.svelte';

	const { page, preloading, session } = stores();
	let root;

	export let segment;

	onMount( () => {
		root = document.documentElement;
	} )

	$: ( (seg) => {
		root && ( seg && root.classList.remove( 'home' ) || !seg && root.classList.add( 'home' ) )
	})(segment)

	async function logout() {
		const r = await post(`auth/logout`);
		if (r.success) $session.user = null;
	}
</script>

<style>

</style>

<Icons/>

<form on:submit|preventDefault={logout} method="post">
	<Nav {segment} {page} logo="logo-sticky.svg">
		<NavItem segment="images">Images</NavItem>
		<NavItem segment="videos">Videos</NavItem>
		<NavItem segment="blog">Blog</NavItem>
		<NavItem segment="about">About</NavItem>
		<NavItem segment="faq">FAQ</NavItem>

		<NavItem external="https://sapper.svelte.dev">Sapper</NavItem>

		<NavItem external="chat" title="Discord Chat">
			<SvelteIcon name="message-square"/>
		</NavItem>

		<NavItem external="https://github.com/sveltejs/svelte" title="GitHub Repo">
			<SvelteIcon name="github"/>
		</NavItem>

		<NavItem title="Login">
		{#if $session.user}
			<Button type="submit" variant="raised"><Label>Logout</Label></Button>
		{:else}
			<a rel='prefetch' aria-current='{segment === "login" ? "page" : undefined}' href='/login'>Login</a>
		{/if}
		</NavItem>
	</Nav>
</form>

<LayoutGrid {segment}>
	<GridItem name="content" let:inner>
		<div class="{inner}">
			{#if segment}
			<Breadcrumb {segment}/>
			{/if}
			<slot></slot>
		</div>
	</GridItem>
	{#if segment}
	<GridItem name="footer" let:inner>
		<div class="{inner}">
			<slot name="footer">Footer</slot>
		</div>
	</GridItem>
	<GridItem name="ad" let:inner>
		<div class="{inner}">
			<slot name="ad">Advertisement</slot>
		</div>
	</GridItem>
	{/if}
</LayoutGrid>