<script>
    import { Header, Modal } from '@sveltejs/site-kit';

    export let segment = '';
</script>

<Header h=2 mdc class="my-8">Users Layout</Header>
<div class="m-8 segment-{segment}">
    <Modal>
        <slot></slot>
    </Modal>
</div>

