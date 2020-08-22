<script>
	import { getContext } from 'svelte';

	export let segment = null;
	export let external = null;
	export let blank = false;
	export let title = null;

	const current = getContext('nav');
</script>

{#if external}
	<li><a target={blank ? '_blank' : ''} href={external} {title}><slot></slot></a></li>
{:else}
	<li class:active="{$current === segment}"><a rel="prefetch" href={segment} {title}><slot></slot></a></li>
{/if}
