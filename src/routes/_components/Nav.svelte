<script>
	import { goto, stores } from '@sapper/app';
	import { post } from 'utils.js';

	import Button from '@smui/button';
	import {Label} from '@smui/common';

	const { page, session } = stores();

	export let segment;

	async function logout() {
		const response = await post(`auth/logout`);
		$session.user = null;
		goto( '/' );
	}
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
		line-height: 2em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	nav li:last-child {
		float: right;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	li > a {
		text-decoration: none;
		padding: 0.8em 0.5em;
		display: block;
	}
	:global(li > button) {
		margin: 0.8em 0;
	}
</style>

<nav>
	<form on:submit|preventDefault={logout} method="post">
		<ul>
			<li>
				<a rel='prefetch' aria-current='{segment === undefined ? "page" : undefined}' href='.'>home</a>
			</li>
			<li>
				<a rel='prefetch' aria-current='{segment === "images" ? "page" : undefined}' href='/images'>images</a>
			</li>
			<li>
				<a rel='prefetch' aria-current='{segment === "video" ? "page" : undefined}' href='/videos'>videos</a>
			</li>
			<li>
				<a rel='prefetch' aria-current='{segment === "about" ? "page" : undefined}' href='/about'>about</a>
			</li>

			<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
				the blog data when we hover over the link or tap it on a touchscreen -->
			<li>
				<a rel='prefetch' aria-current='{segment === "blog" ? "page" : undefined}' href='/blog'>blog</a>
			</li>
			{#if $session.user}
			<li>
				<Button type="submit" variant="raised"><Label>Logout</Label></Button>
			</li>
			{:else}
				<li>
					<a rel='prefetch' aria-current='{segment === "login" ? "page" : undefined}' href='/login'>login</a>
				</li>
			{/if}
		</ul>
	</form>
</nav>
