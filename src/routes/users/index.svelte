<script context="module">
    import * as api from 'api.js';
    import { users } from '../../stores/userStore';

    export async function preload( {path}, {user} ) {

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
    import { Header } from '@sveltejs/site-kit';
    import Layout from './layout.svelte';
    import { UserCard, Unauthorized } from 'components';
    import Paper, {Title, Subtitle, Content} from '@smui/paper';
    import Fab, {Label, Icon} from '@smui/fab';
    import List, {Group, Item, Graphic, Meta, Separator, Subheader, Text, PrimaryText, SecondaryText} from '@smui/list';

    const { session } = stores();

    let selectionUserId;
    let selectionIndex;
    
</script>

<Layout sidebar>
    <Header h=2 mdc class="m-2 lg:m-5">Users</Header>
    <div class="lg:m-8">
        {#if $session.role === "Administrators"}
            {selectionUserId || 'Select User'}
            <Fab class="floating-fab" color="primary" on:click={()=> false} extended><Label>Add User</Label><Icon class="material-icons">add</Icon></Fab>
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
                    <Item on:SMUI:action={() => selectionUserId = user.id} disabled={!user.active} selected={selectionUserId === user.id}>
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