<script>
    import { goto, stores } from '@sapper/app';
    import { post } from 'utils.js';

    import Fab from '@smui/fab';
    import FormField from '@smui/form-field';
    import Checkbox from '@smui/checkbox';
    import Button from '@smui/button';
    import Textfield, {Input, Textarea} from '@smui/textfield';
    import Icon from '@smui/textfield/icon/index';
    import HelperText from '@smui/textfield/helper-text';
    import { Label } from '@smui/common';

    const { session } = stores();

    let password = "kakadax";
    let email = "info@webpremiere.dev";
    let errors;
    let message;

    $: username = email;

    if ($session.user) {
        $session.user = null;
    }

    async function submit( event ) {
        const response = await post("auth/login", {
            email,
            password
        })

        // TODO handle network errors
		errors = response.errors;
		message = response.data.message;

		if (response.success && response.data.user) {
			$session.user = response.data.user;
			goto('/videos');
		}
    };

</script>

<style>



</style>

<form on:submit|preventDefault={submit} method="post">
    <span class="inline">
        <span class="inline-item">
            <Textfield variant="outlined" withLeadingIcon bind:value={email} label="Email" input$aria-controls="helper-text-outlined-email" input$aria-describedby="helper-text-outlined-email" >
                <Icon class="material-icons">mail</Icon>
            </Textfield>
            <HelperText id="helper-text-outlined-email">Helper Text</HelperText>
        </span>
        <span class="inline-item">
            <Textfield variant="outlined" type="password" withTrailingIcon bind:value={password} label="Password" input$aria-controls="helper-text-outlined-password" input$aria-describedby="helper-text-outlined-password" >
                <Icon class="material-icons">login</Icon>
            </Textfield>
            <HelperText id="helper-text-outlined-password">Helper Text</HelperText>
        </span>
        <div>
            <Button type="submit" variant="raised" disabled={!(email && password)}><Label>Submit</Label></Button>
        </div>
    </span>
</form>