<script>
    export let name;
    $: inner = `grid-inner slot-${name}`;
</script>

<style>

    .grid-item {
        display: block;
        padding: 20px;
        background: #eee;
        position: relative;
    }

    :global(.home) .grid-item {
        background: var(--back-white);
    }

</style>

<div class="grid-item {name}">
    <slot inner={inner}></slot>
</div>