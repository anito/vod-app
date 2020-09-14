<script>
	import ListErrors from '../_components/ListErrors.svelte';
	import ListMessages from '../_components/_ListMessages.svelte';
    import LoginForm from '../_components/_LoginForm.svelte';
    import { Header } from '@sveltejs/site-kit';
    import Layout from './layout.svelte';

    let errors = null;
    let message = null;

</script>

<style></style>

<Layout>
    <Header h=2 mdc class="my-8">Login Layout</Header>
    <div class="flex justify-center m-8">
        <div class="grid">
            <div class="cols-3">
                <Header h=4 mdc>Login</Header>
            </div>
            <div class="cols-3">
                <LoginForm />
            </div>
        </div>
    </div>
</Layout>

<ListErrors errors={errors} />
<ListMessages message={message} />