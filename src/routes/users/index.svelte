<script context="module">
    import * as api from 'api.js';
    import { get } from 'svelte/store';
    import { equals } from 'utils';
    import { users } from '../../stores/userStore';
    import { videos } from '../../stores/videoStore';

    export async function preload( { path }, { user } ) {

        let res, vids, data;
        
        res = await api.get( 'users', user && user.token );

        if( res.success ) {
            users.update(res.data)
        } else {
            users.set([])
        }

        res = await api.get( 'videos', user && user.token );

        if( res.success ) {
            vids = get(videos)
            data = res.data;
            if(!equals(vids, data)) videos.update( data );
        } else {
            videos.set( [] );
        }
        
    }

</script>

<script>
    import { stores } from '@sapper/app';
    import Layout from './layout.svelte';
    import { VideoManager, UserManager, TimeManager, Unauthorized } from 'components';
    import Paper, {Title, Subtitle, Content} from '@smui/paper';
    import Button, { Group } from '@smui/button';
    import Fab, { Label, Icon } from '@smui/fab';
    import List, { Item, Graphic, Meta, Separator, Subheader, Text, PrimaryText, SecondaryText } from '@smui/list';

    const { session } = stores();
    const TAB_0 = 'manage-user';
    const TAB_1 = 'manage-video';
    const TAB_2 = 'manage-time';

    let selectionUserId;
    let selectionIndex;
    let tab = TAB_0;

    function setUser(user) {
        selectionUserId = user.id;
    }

    function clickHandler(e) {
        e.target.isSameNode(e.currentTarget) && (selectionUserId = null);
    }

</script>

<style>
    .grid {
        display: grid;
        grid-template-areas:
            "toolbar toolbar"
            "one one";
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 1fr 9fr;
        grid-gap: 5px;
        height: 100%;
        align-items: center;
    }
    :global(.grid.manage-video) {
        grid-template-areas:
            "toolbar toolbar"
            "one two";
    }
    :global(.grid.manage-time) {
        grid-template-areas:
            "toolbar toolbar"
            "one two";
    }
    :global(.loggedin) .grid {
        align-items: initial;
    }
    .grid-item {
        background: var(--back-grid-item);
        padding: 1rem;;
    }
    .toolbar {
        grid-area: toolbar;
        display: flex;
        justify-content: center;
        align-self: center;
    }

</style>

<svelte:head>
	<title>Physiotherapy Online | Users</title>
</svelte:head>

<Layout sidebar>
    <div class="flex flex-auto flex-col justify-center">
        {#if $session.role === "Administrator"}
            <div class="grid {tab}">
                <div class="grid-item toolbar">
                    <Group variant="unelevated">
                        <Button class="focus:outline-none focus:shadow-outline" on:click={() => tab = TAB_0} variant={tab === TAB_0 ? "unelevated" : "outlined"}><Icon class="material-icons">account_circle</Icon><Label>Manage User</Label></Button>
                        <Button class="focus:outline-none focus:shadow-outline" on:click={() => tab = TAB_1} variant={tab === TAB_1 ? "unelevated" : "outlined"}><Icon class="material-icons">video_settings</Icon><Label>Manage Videos</Label></Button>
                        <Button class="focus:outline-none focus:shadow-outline" on:click={() => tab = TAB_2} variant={tab === TAB_2 ? "unelevated" : "outlined"}><Icon class="material-icons">timer</Icon><Label>Manage Time</Label></Button>
                    </Group>
                </div>
                {#if tab === TAB_0}
                    <UserManager
                        {selectionUserId}
                    />
                {/if}
                {#if tab === TAB_1}
                    <VideoManager
                        {$users}
                        {selectionUserId}
                    />
                {/if}
                {#if tab === TAB_2}
                    <TimeManager
                        {$users}
                        {selectionUserId}
                    />
                {/if}
            </div>
        {:else}
            <div class="paper-container flex justify-center">
                <Unauthorized />
            </div>
        {/if}
    </div>
    <div slot="side" style="flex: 1;"
        on:click={clickHandler}
    >
        {#if $session.role === "Administrator"}
            {#if $users.length}
                <List
                    class="demo-list"
                    twoLine
                    avatarList
                    singleSelection
                    bind:selectedIndex={selectionIndex}
                >
                {#each $users as user (user.id)}
                    <Item on:SMUI:action={() => setUser(user)} disabled={!user.active} selected={selectionUserId === user.id}>
                        <Graphic style="background-image: url(https://via.placeholder.com/40x40.png?text={user.name.split(' ').map(val => val.substring(0, 1)).join('')});" />
                        <Text>
                            <PrimaryText>{user.name}</PrimaryText>
                            <SecondaryText>{user.email}</SecondaryText>
                        </Text>
                        <Meta class="material-icons">info</Meta>
                    </Item>
                {/each}
                </List>
            {:else}
                <div class="paper-container flex justify-center">
                    <Paper color="primary">
                        <Title style="color: var(--text-light)">No Users</Title>
                    </Paper>
                </div>
            {/if}
            <Fab class="floating-fab" color="primary" on:click={()=> false} extended><Label>Add User</Label><Icon class="material-icons">add</Icon></Fab>
        {/if}
    </div>
    <div slot="ad">
        Users Ad
    </div>
    <div slot="footer">
        Users Footer
    </div>
</Layout>