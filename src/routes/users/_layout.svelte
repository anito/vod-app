<script context="module">
    import * as api from 'api.js';

    export async function preload( { query }, { user }) {

        const resVideo = await api.get( 'videos', user && user.token );
        const resUser = await api.get( 'users', user && user.token );
        
        if( resUser.success && resVideo.success ) {
            const userData = resUser.data;
            const videoData = resVideo.data;
            return { userData, videoData, ...query };
        }
	}
</script>

<script>
    import { Modal } from '@sveltejs/site-kit';
    import Layout from './layout.svelte';
    import { Unauthorized } from 'components';
    import Paper, {Title, Subtitle, Content} from '@smui/paper';
    import Fab, { Label, Icon } from '@smui/fab';
    import List, { Item, Graphic, Meta, Separator, Subheader, Text, PrimaryText, SecondaryText } from '@smui/list';
    import { stores, goto } from '@sapper/app';
    import { users } from '../../stores/userStore';
    import { videos } from '../../stores/videoStore';

    const { session } = stores();
    
    const TAB = 'manage-user';

    export let segment; // our user.id in case we start from a specific user
    // from preload
    export let userData = [];
    export let videoData = [];
    export let tab = TAB;

    let selectionIndex;
    let selectionUserId = segment;

    $: tab = (t=>!t && TAB || t)(tab);
    
    // update stores with what we got from preload
    users.update(userData);
    videos.update(videoData);

    async function setUser(id) {
        selectionUserId = id;
        await goto(`users/${selectionUserId}?tab=${tab}`)
    }

    function clickHandler(e) {
        e.target.isSameNode(e.currentTarget) && (selectionUserId = null);
    }
    
</script>

<style>

</style>

<div class:segment>
    <Modal>
        <Layout sidebar>
            {#if $session.role === "Administrator"}
                <slot></slot>
            {:else}
                <div class="paper-container flex justify-center">
                    <Unauthorized />
                </div>
            {/if}
            <div slot="side" style="flex: 1;" on:click={clickHandler} >
                {#if $session.role === "Administrator"}
                    {#if $users.length}
                        <List
                            class="users-list"
                            twoLine
                            avatarList
                            singleSelection
                            bind:selectedIndex={selectionIndex}
                        >
                        {#each $users as user (user.id)}
                            <Item on:SMUI:action={() => setUser(user.id)} disabled={!user.active} selected={selectionUserId == user.id}>
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
    </Modal>
</div>
