<script context="module">
    import * as api from 'api.js';
    import { users } from '../../stores/userStore';

    export async function preload( { params, query }, {user} ) {

		const res = await api.get(`users/${params.slug}`, user && user.token);
        
		if (res.success) {
            const { id, name } = { ...res.data }
			return { id, name, ...query };
		} else {
			this.error(res.status, res.data.message);
		}
	}
</script>

<script>
    import { goto } from '@sapper/app';
	import { VideoManager, UserManager, TimeManager } from 'components';
	import Button, { Group, Label, Icon } from '@smui/button';

	const TABS = [
        'user',
        'video',
        'time',
    ]
    
    // available from preload
    export let id;
    export let name;
    export let tab = 'user';
	
    let selectionUserId;

    $: selectionUserId = id;
    $: tab = (t => (TABS.findIndex(itm => itm === t) === -1) && TABS[0] || t)(tab);
    
    async function changeTab(tab) {
        const res = await goto(`users/${selectionUserId}/?tab=${tab}`)
    }

</script>

<style>
    .grid {
        display: grid;
        grid-template-areas:
            "toolbar toolbar"
            "one one";
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: var(--toolbar-h) calc(100vh - var(--nav-h) - var(--breadcrumb-h) - var(--toolbar-h) - var(--footer-section-h));
        grid-gap: 5px;
        height: 100%;
        align-items: center;
    }
    :global(.grid.video) {
        grid-template-areas:
            "toolbar toolbar"
            "one two";
    }
    :global(.grid.time) {
        grid-template-areas:
            "toolbar toolbar"
            "one two";
    }
    :global(.loggedin) .grid {
        align-items: initial;
    }
    .grid-item {
        background: var(--back-grid-item);
        padding-left: 0.4rem;
    }
    .toolbar {
        grid-area: toolbar;
        display: flex;
        align-items: center;
        height: var(--toolbar-h);
    }
</style>

<svelte:head>
	<title>Physiotherapy Online | User {name}</title>
</svelte:head>

<div class="grid {tab}">
    <div class="grid-item toolbar">
        <Group variant="unelevated">
            <Button class="focus:outline-none focus:shadow-outline" on:click={() => changeTab(TABS[0])} variant={tab === TABS[0] ? "unelevated" : ""}><Icon class="material-icons">account_circle</Icon><Label>Manage User</Label></Button>
            <Button class="focus:outline-none focus:shadow-outline" on:click={() => changeTab(TABS[1])} variant={tab === TABS[1] ? "unelevated" : ""}><Icon class="material-icons">video_settings</Icon><Label>Manage Videos</Label></Button>
            <Button class="focus:outline-none focus:shadow-outline" on:click={() => changeTab(TABS[2])} variant={tab === TABS[2] ? "unelevated" : ""}><Icon class="material-icons">timer</Icon><Label>Manage Time</Label></Button>
        </Group>
    </div>
    {#if tab === TABS[0]}
        <UserManager
            {selectionUserId}
        />
    {/if}
    {#if tab === TABS[1]}
        <VideoManager
            {$users}
            {selectionUserId}
        />
    {/if}
    {#if tab === TABS[2]}
        <TimeManager
            {$users}
            {selectionUserId}
        />
    {/if}
</div>