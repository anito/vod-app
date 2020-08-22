<script>

    export let segment;
    let className = '';
    export {className as class};
    export let stretch = false;
</script>

<style>
    main {
		position: relative;
		margin: 0 auto;
		/* padding: var(--nav-h) var(--side-nav) 0 var(--side-nav); */
		padding: var(--nav-h) 0 0 0;
		overflow-x: hidden;
    }

    :global(.grid-item.has-background.content) {
        background: var(--prime)
    }
    :global(.grid-item.has-background.side) {
        background: var(--second)
    }
    :global(.grid-item.has-background.footer) {
        background: var(--flash)
    }
    :global(.grid-item.has-background.ad) {
        background: var(--alt)
    }
    .grid {
        display: grid;
        grid-gap: 5px;
        grid-template-rows: 2fr 8fr 1fr 1fr;
        grid-template-columns: 1fr;
        grid-template-areas:
            "content"
            "content"
            "ad"
            "footer";
        height: calc(99vh - var(--nav-h));
    }
    .grid.users {
        grid-template-columns: 1fr;
        grid-template-areas:
            "side"
            "content"
            "ad"
            "footer";
    }
    .grid.full-grid {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        grid-template-areas:
            "content"
    }
    .grid :global(.content) {
        grid-area: content
    }
    .grid :global(.side) {
        grid-area: side
    }
    .grid :global(.footer) {
        grid-area: footer
    }
    .grid :global(.ad) {
        grid-area: ad
    }

    @media (min-width: 900px) {

        .grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto 60px;
            grid-template-areas:
                "content content"
                "ad footer"
        }
        .grid.users {
            grid-template-columns: var(--sidebar-w) 6fr;
            grid-template-areas:
                "side content"
                "ad footer"
        }
    }
    @media (min-width: 1200px) {

        .grid {
            grid-template-columns: var(--sidebar-w) 6fr;
            grid-template-areas:
                "content content"
                "ad footer "
        }
        .grid.users {
            grid-template-areas:
                "side content "
                "ad footer "
        }
    }

</style>

<main>
    <div class:full-grid={!segment} class="
        {segment}
        grid
        {className}
        {stretch ? 'stretch' : ''}">
        <slot></slot>
    </div>
</main>