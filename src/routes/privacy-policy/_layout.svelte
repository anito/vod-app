<script>
    import Layout from "./layout.svelte";
    export let segment;
</script>

<div class:segment>
    <Layout>
        <slot />
        <slot name="add" />
        <slot name="footer" />
    </Layout>
</div>
