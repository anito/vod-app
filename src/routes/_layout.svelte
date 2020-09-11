<script>
	import { goto, stores } from '@sapper/app';
	import { onMount } from 'svelte';
	import { setContext } from 'svelte';
	import { Icon as SvelteIcon, Icons, Nav, NavItem } from '@sveltejs/site-kit';

	import Button from '@smui/button';
	import { Label } from '@smui/common';
	import Fab, { Icon } from '@smui/fab';
	import { post } from 'utils.js';
	import Tags from './_components/Tags.svelte';
	import Snackbar, {Actions, Label as SnackbarLabel} from '@smui/snackbar';
	import { GridItem, LayoutGrid } from '@sveltejs/site-kit';
	import Breadcrumb from './_components/_Breadcrumb.svelte';
	import Layout from './layout.svelte';
	// import ListErrors from './_components/ListErrors.svelte';

	export let segment;
	
	const { page, preloading, session } = stores();
	const adTags = [
		'aaa',
		'bbb',
		'ccc'
	]
	const footerTags = [
		'ddd',
		'eee',
		'fff'
	]


	let root;
	let snackbar;
	let message = '';

	onMount( () => {
		root = document.documentElement;
	} )

	$: ( (seg) => {
		root && ( seg && root.classList.remove( 'home' ) || !seg && root.classList.add( 'home' ) )
	})(segment)

	async function logout() {
		const r = await post(`auth/logout`);
		if (r.success) {
			$session.user = null;
			message = r.data.message;
			snackbar.open();
		}
	}

	function handleClosed() {
		//
	}

	function redirect(p) {
		snackbar.close();
		goto(p)
	}
</script>

<style>

</style>

<Icons/>

<form on:submit|preventDefault={logout} method="post">
	<Nav {segment} {page} logo="logo-sticky.svg">
		<NavItem segment="videos">Videos</NavItem>
		<NavItem segment="images">Posters</NavItem>
		<NavItem segment="users">Users</NavItem>

		<NavItem blank external="http://localhost:3001">Svelte</NavItem>
		<NavItem external="https://sapper.svelte.dev">Sapper</NavItem>

		<NavItem title="Login">
		{#if $session.user}
			<Button type="submit" variant="raised"><Label>Logout</Label></Button>
		{:else}
			<a rel='prefetch' aria-current='{segment === "login" ? "page" : undefined}' href='/login'>Login</a>
		{/if}
		</NavItem>
	</Nav>
</form>

<Layout {segment} {page}>
	<slot></slot>
	<div slot="side">
		Sidebar
	</div>
	<div slot="ad">
		Ads
	</div>
	<div slot="footer">
		Footer
	</div>
</Layout>

<Snackbar variant="stacked" bind:this={snackbar} labelText={message} on:MDCSnackbar:closed={handleClosed}>
	<SnackbarLabel></SnackbarLabel>
	<Actions>
        <Button on:click={() => redirect('/login')}>Goto Login</Button>
	</Actions>
</Snackbar>