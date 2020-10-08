<script context="module">
    import * as api from 'api.js';
    import { get } from 'svelte/store';
    import { users } from '../../stores/userStore';
    import { videos } from '../../stores/videoStore';

    export async function preload( { query }, { user }) {

        let userData, videoData, resUser, resVideo;

        // fetch only if we haven't any data yet
        if( (userData = get(users)) && !userData.length) {
            resUser = await api.get( 'users', user && user.token );
            
            if( resUser.success ) {
                userData = resUser.data;
            }
        }
        
        // fetch only if we haven't any data yet
        if( (videoData = get(videos)) && !videoData.length) {
            resVideo = await api.get( 'videos', user && user.token );

            if( resVideo.success ) {
                videoData = resVideo.data;
            }
        }

        return { userData, videoData, ...query };
        
	}
</script>

<script>
    import { Modal } from '@sveltejs/site-kit';
    import Layout from './layout.svelte';
    import { Unauthorized } from 'components';
    import Paper, {Title, Subtitle, Content} from '@smui/paper';
    import List, { Item, Graphic, Meta, Separator, Subheader, Text, PrimaryText, SecondaryText } from '@smui/list';
    import { stores, goto } from '@sapper/app';

    const { session } = stores();
    
    const TAB = 'user';

    export let segment; // our user.id (or slug) in case we start from a specific user like /users/23
    // from preload
    export let userData = [];
    export let videoData = [];
    export let tab = TAB;

    let selectionIndex;

    $: selectionUserId = segment;
    $: tab = (t=>!t && TAB || t)(tab);
    
    // update stores with what we got from preload
    users.update(userData);
    videos.update(videoData);

    async function setUser(id) {
        selectionUserId = id;
        await goto(`users/${selectionUserId}?tab=${tab}`)
    }

    // deselect
    async function clickHandler(e) {
        if(e.target.isSameNode(e.currentTarget)) {

            // let's redirect to sync view in case user gets deselected
            await goto('users');
        }
        return false;
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
            <div slot="side" style="flex: 1;" on:click|stopPropagation|preventDefault={clickHandler} >
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
