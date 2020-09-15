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
    import Snackbar, {Actions, Label as SnackbarLabel} from '@smui/snackbar';

    const { session } = stores();

    let snackbar;
    let password = "Test@005";
    let email = "test@webpremiere.de";
    let errors;
    let message;
    let timeout;

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
            message += '. Redirecting...';
            snackbar.open();
			timeout = window.setTimeout(redirect, 5000, '/videos');
		} else {
            snackbar.open();
        }
    };
    function redirect(p) {
        snackbar.close();
		goto(p);
	}

    function handleClosed() {
		//
	}
</script>

<style>

    .login-grid {
        grid-row-gap: .5rem;
    }

    @media screen and (min-width: 840px) {

        .login-grid {
            grid-template-areas:
                "email pass"
                "button button";
            grid-template-columns: repeat(2, 1fr);
            grid-row-gap: 1rem;
        }
        
        .email-area {
            grid-area: email;
        }
    
        .pass-area {
            grid-area: pass;
        }
    
        .button-area {
            grid-area: button;
        }
    }

</style>

<form on:submit|preventDefault={submit} method="post">
    <div class="grid login-grid">
        <span class="email-area lg:mr-2">
            <Textfield variant="outlined" withLeadingIcon bind:value={email} label="Email" input$aria-controls="helper-text-outlined-email" input$aria-describedby="helper-text-outlined-email" >
                <Icon class="material-icons">mail</Icon>
            </Textfield>
            <HelperText id="helper-text-outlined-email">Helper Text</HelperText>
        </span>
        <span class="pass-area lg:ml-2">
            <Textfield variant="outlined" type="password" withTrailingIcon bind:value={password} label="Password" input$aria-controls="helper-text-outlined-password" input$aria-describedby="helper-text-outlined-password" >
                <Icon class="material-icons">login</Icon>
            </Textfield>
            <HelperText id="helper-text-outlined-password">Helper Text</HelperText>
        </span>
        <div class="button-area flex">
            <Button class="flex-1" type="submit" variant="raised" disabled={!(email && password)}><Label>Submit</Label></Button>
        </div>
    </div>
</form>

<Snackbar variant="stacked" bind:this={snackbar} labelText={message} on:MDCSnackbar:closed={handleClosed}>
	<SnackbarLabel></SnackbarLabel>
</Snackbar>