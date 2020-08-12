<script>
	import { onMount } from 'svelte';


	let container;
	let match;
	let className = '';

	const regex = /[1-6]/g;
	const DEFAULT_LEVEL = "1";
	export let h = DEFAULT_LEVEL;
    export {className as class};
    export let mdc = false;

	onMount( (x) => {
		h = h.toString();
		h = (match=h.match(regex)) && match.length && match[0];

		if(!h) h = LEVEL;

        const header = document.createElement( `h${h}` );
        mdc && header.classList.add(`mdc-typography--headline${h}`);
		header.append(container.childNodes[0]);
		container.append(header);
	})

</script>

<style>
    [class*="mdc-typography--headline"] {
        margin: 0.2em 0 0.5em;
    }
</style>

<div
    bind:this={container}
    class="svelte-header {className}">
	<slot>No Content</slot>
</div>