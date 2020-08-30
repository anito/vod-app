<script>
	import ListErrors from '../_components/ListErrors.svelte';
	import ListMessages from '../_components/_ListMessages.svelte';
    import LoginForm from '../_components/_LoginForm.svelte';
    import { Header } from '@sveltejs/site-kit';

    let errors = null;
    let message = null;

</script>

<style></style>

<div class="grid">
    <div class="cols-3">
        <Header h=4 mdc>Login</Header>
    </div>
    <div class="cols-3">
        <LoginForm />
    </div>
</div>

<ListErrors errors={errors} />
<ListMessages message={message} />