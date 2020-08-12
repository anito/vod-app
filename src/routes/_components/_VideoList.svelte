<script>
	import { goto, stores } from '@sapper/app';
	import { videos } from '../../stores/videoStore';
	import { post } from 'utils.js';

	import Fab from '@smui/fab';
	import FormField from '@smui/form-field';
	import Button from '@smui/button';
	import Textfield, {Input, Textarea} from '@smui/textfield';
	import Icon from '@smui/textfield/icon/index';
	import HelperText from '@smui/textfield/helper-text';
	import { Label } from '@smui/common';

	import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
	import Checkbox from '@smui/checkbox';

	const { session } = stores();

	let selected = [];

</script>

<DataTable table$aria-label="Products">
	<Head>
		<Row>
			<Cell><Checkbox checkbox /></Cell>
			<Cell>ID</Cell>
			<Cell>Title</Cell>
			<Cell>Description</Cell>
			<Cell>Created</Cell>
		</Row>
	</Head>
	<Body>
	{#if $videos && $videos.length}
		{#each $videos as { id, title, description, created }, i (id)}
		<Row>
			<Cell><Checkbox bind:group={selected} value={title} valueKey={id} /></Cell>
			<Cell>{id}</Cell>
			<Cell>{title}</Cell>
			<Cell>{description}</Cell>
			<Cell date>{created}</Cell>
		</Row>
		{/each}
	{:else}
		<Row>
			<Cell colspan="5">no videos</Cell>
		</Row>
	{/if}
	</Body>
</DataTable>