<script>
    import { Modal } from '@sveltejs/site-kit';

    export let segment;
</script>

<div class:segment>
    <Modal>
        <slot></slot>
    </Modal>
</div>

