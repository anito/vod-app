<script>
    import { Header } from '@sveltejs/site-kit';

    export let segment;
</script>

<Header h=2 mdc class="my-8">Login Layout</Header>
<div class="flex justify-center m-8 segment-{segment}">
    <slot></slot>
</div>