<script>
    import { goto, stores } from '@sapper/app';

    const { page } = stores();

    export let segment;
    $: slug = $page.params && $page.params.slug ? `/ ${$page.params.slug}` : '';

</script>

<style>

    .breadcrumb {
		padding: 10px;
        background: var(--back);
        font-size: var(--code-fs);
        text-transform: uppercase;
        margin-bottom: 2em;
	}

</style>

<div class="breadcrumb lg:m-2"><a href=".">home</a> / {segment} {slug}</div>