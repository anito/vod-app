<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vime/core@latest/themes/default.css">
</svelte:head>

<script>
    import { Header, Modal } from '@sveltejs/site-kit';

    export let segment = '';
</script>

<Header h=2 mdc class="my-8">Video Layout</Header>
<div class="m-8 segment-{segment}">
    <Modal>
        <slot></slot>
    </Modal>
</div>

