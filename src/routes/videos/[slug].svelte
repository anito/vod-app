<script context="module">
    import * as api from 'api.js';

    export async function preload({params, query}, {user}) {
		// the `slug` parameter is available because
        // this file is called [slug].svelte
		const res = await api.get(`videos/${params.slug}`, user && user.token);

		if (res.success) {
			return res.data;
		} else {
			this.error(res.status, res.data.message);
		}
	}
</script>

<script>
    import Display from '../_components/_Display.svelte';
    export const data = {
        id,
        image_id,
        title,
        description,
        src,
        filesize,
        user_id,
        sequence,
        modified,
        created
    };

</script>

<Display {data}/>

