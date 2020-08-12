<script>

    import { goto, stores } from '@sapper/app';
	import ListErrors from '../_components/ListErrors.svelte';
	import { post } from 'utils.js';

	import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';

	const { session } = stores();

</script>

