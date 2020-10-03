<script context="module">
    import * as api from 'api.js';
    import { users } from '../../stores/userStore';

    let _user;
    export async function preload( { path}, { user } ) {

        const res = await api.get( 'users', user && user.token );
        
        if( res.success ) {
            users.update(res.data)
        } else {
            users.set([])
        }
        
    }

</script>

<script>
    import { stores } from '@sapper/app';
    import Layout from './layout.svelte';
    import { SimpleVideoCard, VideosManager, Unauthorized } from 'components';
    import Paper, {Title, Subtitle, Content} from '@smui/paper';
    import Button, { Group } from '@smui/button';
    import Fab, { Label, Icon } from '@smui/fab';
    import List, { Item, Graphic, Meta, Separator, Subheader, Text, PrimaryText, SecondaryText } from '@smui/list';

    const { session } = stores();

    let selectionUserId;
    let selectionIndex;
    let selectionVideoId;
    let tab = 1;

    $: userVideos = (typeof selectionIndex == 'number' && selectionIndex !== -1) && $users[selectionIndex].videos;
    $: videoIndex = userVideos && userVideos.findIndex(vid=>vid.id === selectionVideoId);
    $: selectedVideo = typeof videoIndex == 'number' && videoIndex > -1 && userVideos[videoIndex];

    function videoSelectedHandler(e) {
        selectionVideoId = e.detail.id;
    }

    function setUser(user) {
        selectionVideoId = null;
        selectionUserId = user.id;

    }
    
</script>

<style>
    .grid {
        display: grid;
        grid-template-areas:
            "toolbar toolbar"
            "user-videos videos";
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 1fr 9fr;
        grid-gap: 5px;
        height: 100%;
        align-items: center;
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

<Layout sidebar>
    <div class="flex flex-auto flex-col justify-center">
        {#if $session.role === "Administrators"}
            <div class="grid">
                <div class="grid-item toolbar">
                    <Group variant="unelevated">
                        <Button class="focus:outline-none focus:shadow-outline active:bg-indigo-600" disabled={!selectionUserId} on:click={() => tab = 0} variant={tab === 0 ? "unelevated" : "outlined"}><Icon class="material-icons">account_circle</Icon><Label>Manage User</Label></Button>
                        <Button class="focus:outline-none focus:shadow-outline active:bg-indigo-600" disabled={!selectionUserId} on:click={() => tab = 1} variant={tab === 1 ? "unelevated" : "outlined"}><Icon class="material-icons">video_settings</Icon><Label>Manage Videos</Label></Button>
                        <Button class="focus:outline-none focus:shadow-outline active:bg-indigo-600" disabled={!selectedVideo} on:click={() => tab = 2} variant={tab === 2 ? "unelevated" : "outlined"}><Icon class="material-icons">timer</Icon><Label>Manage Time</Label></Button>
                    </Group>
                </div>
                {#if tab === 0}
                <div class="grid-item user-videos">
                    Nothing here
                </div>
                <div class="grid-item videos">
                    Nothing here
                </div>
                {/if}
                {#if tab === 1}
                    <VideosManager
                        on:videoSelected={videoSelectedHandler}
                        {$users}
                        {selectionUserId}
                    />
                {/if}
                {#if tab === 2}
                <div class="grid-item user-videos">
                    Nothing here
                </div>
                <div class="grid-item videos">
                    Nothing here
                </div>
                {/if}
            </div>
        {:else}
            <div class="paper-container flex justify-center">
                <Unauthorized />
            </div>
        {/if}
    </div>
    <div slot="side">
        {#if $session.role === "Administrators"}
            {#if $users.length}
                <List class="demo-list" twoLine avatarList singleSelection bind:selectedIndex={selectionIndex}>
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