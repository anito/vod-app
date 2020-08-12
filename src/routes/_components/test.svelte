<script>

    { goto, stores } from '@sapper/app';
	import ListErrors from '../_components/ListErrors.svelte';
	import { post } from 'utils.js';

	import Fab from '@smui/fab';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import Button from '@smui/button';
	import Textfield, {Input, Textarea} from '@smui/textfield';
	import Icon from '@smui/textfield/icon/index';
	import HelperText from '@smui/textfield/helper-text';
	import {Label} from '@smui/common';

	const { session } = stores();

</script>