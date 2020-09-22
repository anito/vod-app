<script>
	import { goto, stores } from '@sapper/app';
	import isMobile from 'ismobilejs';
	import { onMount, setContext } from 'svelte';
	import { Icon as SvelteIcon, Icons, Nav, NavItem } from '@sveltejs/site-kit';

	import Button from '@smui/button';
	import { Label } from '@smui/common';
	import Fab, { Icon } from '@smui/fab';
	import { post } from 'utils.js';
	import { Tags } from 'components';
	import Snackbar, {Actions, Label as SnackbarLabel} from '@smui/snackbar';
	
	// import ListErrors from 'components';

	export let segment;
	
	const { page, session } = stores();

	let root;
	let snackbar;
	let message = '';
	let delayedTimeout;
	let isMobileDevice;

	async function logout() {
		const r = await post(`auth/logout`);
		if (r.success) {
			$session.user = null;
			$session.role = null;

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

	onMount( () => {
		root = document.documentElement;
		(!window.snackbar) && (window.snackbar = snackbar)

		isMobileDevice && root.classList.add('ismobile')
	} )

	function delayedReopen() {
		clearTimeout(delayedTimeout);
		delayedTimeout = setTimeout(() => snackbar.open(), 2000)
	}

	$: ( (seg) => {
		root && ( seg && root.classList.remove( 'home' ) || !seg && root.classList.add( 'home' ) )
	})(segment)

	$: isMobileDevice  = isMobile().any;

	
</script>

<style>

</style>

<Icons/>

<form on:submit|preventDefault={logout} method="post">
	<Nav {segment} {page} logo="logo-sticky.svg">
		<NavItem segment="videos">Videos</NavItem>
		<NavItem segment="images">Posters</NavItem>
		{#if $session.role === "Administrators"}
		<NavItem segment="users">Users</NavItem>
		{/if}
		<NavItem segment="about">About</NavItem>

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

<slot></slot>

<Snackbar timeoutMs=10000 bind:this={snackbar} labelText={message} on:MDCSnackbar:closed={handleClosed}>
	<SnackbarLabel></SnackbarLabel>
	<Actions>
        <Button variant="raised" on:click={() => redirect('/login')}>Goto Login</Button>
	</Actions>
</Snackbar>