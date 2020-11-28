<script context="module">
  import * as api from "api.js";
  import { users } from "../../stores/userStore";
  import { videos } from "../../stores/videoStore";

  export async function preload({ query }, { user }) {
    let usersData, videoData;

    const resUsers = await api.get("users", user && user.token);

    if (resUsers.success) {
      usersData = resUsers.data;
    } else {
      this.error(
        (resUsers.data && resUsers.data.code) || resUsers.status,
        (resUsers.data && resUsers.data.message) || resUsers.responseText
      );
    }

    const resVideo = await api.get("videos", user && user.token);

    if (resVideo.success) {
      videoData = resVideo.data;
    } else {
      this.error(
        (resVideo.data && resVideo.data.code) || resVideo.status,
        (resVideo.data && resVideo.data.message) || resVideo.responseText
      );
    }

    return { usersData, videoData, ...query };
  }
</script>

<script>
  import { stores, goto } from "@sapper/app";
  import { onMount } from "svelte";
  import { getMedia } from "utils";
  import Layout from "./layout.svelte";
  import { Info, UserGraphic } from "components";
  import Paper, { Title } from "@smui/paper";
  import Fab, { Label, Icon } from "@smui/fab";
  import List, {
    Item,
    Meta,
    Separator,
    Subheader,
    Text,
    PrimaryText,
    SecondaryText,
  } from "@smui/list";

  const { session } = stores();
  const TAB = "time";
  const placeholder = "https://via.placeholder.com/40x40.png?text=";

  let preSelectedIndex = 0;

  export let segment; // our user.id (or slug) in case we start from a specific user like /users/23
  // from preload
  export let usersData = [];
  export let videoData = [];
  export let tab = TAB;

  // update stores with what we got from preload
  users.update(usersData);
  videos.update(videoData);

  let selectionIndex;

  $: selectionUserId = segment;
  $: tab = ((t) => (!t && TAB) || t)(tab);
  $: avatar = async (user) => {
    let res,
      avatar = user.avatar;
    if (!avatar) return defaultAvatar(user);
    res = await getMedia("AVATAR", avatar.id, $session.user, {
      width: 40,
      height: 40,
      square: 1,
    });
    if (res) return res;
  };

  onMount(() => {
    if (segment || !$users.length) return;

    let max = $users.length - 1;
    preSelectedIndex =
      preSelectedIndex < 0 || preSelectedIndex > max ? 0 : preSelectedIndex;

    goto(`users/${$users[preSelectedIndex].id}`);
  });

  function defaultAvatar(user) {
    let name = user.name || "?";
    return `${placeholder}${name
      .split(" ")
      .map((val) => val.substring(0, 1))
      .join("")}`;
  }

  async function setUser(id) {
    selectionUserId = id;
    await goto(`users/${selectionUserId}?tab=${tab}`);
  }

  // deselect
  async function clickHandler(e) {
    if (e.target.isSameNode(e.currentTarget)) {
      // let's redirect to sync view in case user gets deselected
      await goto("users");
    }
    return false;
  }

  async function addUser() {
    await goto("users/add");
  }
</script>

<style>
  .paper-container {
    display: flex;
    flex: 1;
    justify-content: center;
  }
  .vcentered {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .fab-add-user {
    position: absolute;
  }
  :global(.datapicker--open) .fab-add-user,
  :global(.add-user-view--open) .fab-add-user {
    display: none;
  }
</style>

<div class:segment>
  <Layout sidebar>
    {#if $session.role === 'Administrator'}
      <slot />
    {:else}
      <div class="paper-container">
        <div class="vcentered">
          <Info title="Unauthorized" let:href>
            <a {href} on:click|preventDefault={() => goto(href)}>Login</a>
          </Info>
        </div>
      </div>
    {/if}
    <div
      slot="side"
      style="flex: 1;"
      on:click|stopPropagation|preventDefault={clickHandler}>
      {#if $session.role === 'Administrator'}
        {#if $users.length}
          <List
            class="users-list"
            twoLine
            avatarList
            singleSelection
            bind:selectedIndex={selectionIndex}>
            {#each $users as user (user.id)}
              <Item
                on:SMUI:action={() => setUser(user.id)}
                disabled={!user.active}
                selected={selectionUserId == user.id}>
                <UserGraphic width="40" height="40" {user} />
                <Text>
                  <PrimaryText>{user.name}</PrimaryText>
                  <SecondaryText>{user.email}</SecondaryText>
                </Text>
                <Meta class="material-icons">
                  {user.protected ? 'lock' : 'info'}
                </Meta>
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
    <div slot="ad">Users Ad</div>
    <div slot="footer">Users Footer</div>
  </Layout>
  <div class="fab-add-user">
    <Fab class="floating-fab" color="primary" on:click={addUser} extended>
      <Label>Add User</Label>
      <Icon class="material-icons">add</Icon>
    </Fab>
  </div>
</div>
