<script context="module">
  import * as api from "api.js";
  import { users } from "../../stores/userStore";
  import { videos } from "../../stores/videoStore";

  export async function preload({ query }, { user }) {
    let userData, videoData, code;

    const resUser = await api.get("users", user && user.token);

    if (resUser.success) {
      userData = resUser.data;
    } else {
      this.error(resUser.data.code, resUser.data.message);
    }

    const resVideo = await api.get("videos", user && user.token);

    if (resVideo.success) {
      videoData = resVideo.data;
    } else {
      this.error(resVideo.data.code, resVideo.data.message);
    }

    return { userData, videoData, ...query };
  }
</script>

<script>
  import { Modal } from "@sveltejs/site-kit";
  import Layout from "./layout.svelte";
  import { Info } from "components";
  import Paper, { Title, Subtitle, Content } from "@smui/packages/paper";
  import List, {
    Item,
    Graphic,
    Meta,
    Separator,
    Subheader,
    Text,
    PrimaryText,
    SecondaryText,
  } from "@smui/packages/list";
  import { stores, goto } from "@sapper/app";
  import { userEmitter } from "../../stores/userEmitter";

  const { session } = stores();
  const TAB = "time";

  export let segment; // our user.id (or slug) in case we start from a specific user like /users/23
  // from preload
  export let userData = [];
  export let videoData = [];
  export let tab = TAB;

  let selectionIndex;
  let user = $session.user;

  $: selectionUserId = segment;
  $: tab = ((t) => (!t && TAB) || t)(tab);

  // update stores with what we got from preload
  users.update(userData);
  videos.update(videoData);

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

  async function put(item) {
    const res = await api.put(`users/${item.id}`, item, user && user.token);
    if (res && res.success) {
      users.put(item);
    }
  }

  async function get(id = "") {
    const res = await api.get(`users/${id}`, user && user.token);
    if (res && res.success) {
      users.update(res.data);
    }
  }

  userEmitter.subscribe((t) => {
    if ("post" === t.method) {
      post(t.data);
    }
    if ("put" === t.method) {
      put(t.data);
    }
    if ("get" === t.method) {
      get(t.data);
    }
    if ("del" === t.method) {
      del(t.data);
    }
  });
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
</style>

<div class:segment>
  <Modal>
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
                  <Graphic
                    style="background-image: url(https://via.placeholder.com/40x40.png?text={user.name
                      .split(' ')
                      .map((val) => val.substring(0, 1))
                      .join('')});" />
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
      <div slot="ad">Users Ad</div>
      <div slot="footer">Users Footer</div>
    </Layout>
  </Modal>
</div>
