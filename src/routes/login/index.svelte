<script>
	import { ListErrors } from 'components';
	import { ListMessages } from 'components';
    import { LoginForm } from 'components';
    import { Header } from '@sveltejs/site-kit';
    import Layout from './layout.svelte';

    let errors = null;
    let message = null;

</script>

<style></style>

<Layout>
    <Header h=2 mdc class="m-2 lg:m-5">Login</Header>
    <div class="flex justify-center m-8">
        <div class="grid">
            <div class="cols-3">
                <Header h=4 mdc class="m-2">Please fill in form to see content</Header>
            </div>
            <div class="cols-3">
                <LoginForm />
            </div>
        </div>
    </div>
</Layout>

<ListErrors errors={errors} />
<ListMessages message={message} />