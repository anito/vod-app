<script context="module">
  import * as api from "api";

  export async function preload({ params, query }, { user }) {
    let inboxData = [];
    let sentData = [];

    if (query["tab"] === "mail") {
      const id = params["slug"];

      await api.get(`sents/get/${id}`, user?.jwt).then((res) => {
        res.success && (sentData = res.data);
      });

      await api.get(`inboxes/get/${id}`, user?.jwt).then((res) => {
        res.success && (inboxData = res.data);
      });
    }
    return { inboxData, sentData };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";
  import { UserManager, TimeManager, MailManager } from "components";
  import Button, { Group, Label, Icon } from "@smui/button";
  import { users, sitename } from "stores";
  import { proxyEvent, extendSession } from "utils";
  import { _ } from "svelte-i18n";

  export let sentsData;
  export let inboxData;

  const TABS = ["user", "time", "mail"];
  const { page, session } = stores();

  let userExpires;
  let hasExpired;
  let token;
  let magicLink;
  let currentUser;
  let username;

  $: selected_tab = ($page.query && $page.query.tab) || "time";
  $: selectionUserId = $page.params.slug;
  $: (selected_tab || selectionUserId) && extendSession();
  $: currentUser = ((id) =>
    $users.length && $users.filter((usr) => usr.id === id)[0])(selectionUserId);
  $: username = (currentUser && currentUser.name) || "";
  $: tab = ((t) => TABS.find((itm) => itm === t) || TABS[1])(selected_tab);
  $: ((user) => {
    if (!user) return;
    userExpires = user.expires;
    hasExpired =
      (userExpires && userExpires * 1000 < +new Date().getTime()) || false;
    token = user?.jwt;
    magicLink = token && `http://${$page.host}/login?token=${token}`;
  })(currentUser);
  $: hidden =
    $session.role !== "Administrator"
      ? true
      : selectionUserId == $session.user.id
      ? true
      : false;

  onMount(() => {});
</script>

<svelte:head>
  <title>{$sitename} | User {username}</title>
</svelte:head>

<div class="flex flex-1 user-grid inner-grid {tab}">
  <div class="grid-item toolbar justify-between">
    <Group variant="unelevated">
      <Button
        class="focus:outline-none focus:shadow-outline"
        rel="prefetch"
        href="users/{selectionUserId}?tab=time"
        variant={tab === TABS[1] ? "unelevated" : "outlined"}
      >
        <Icon class="material-icons">video_settings</Icon>
        <Label>{$_("text.classes")}</Label>
      </Button>
      <Button
        class="focus:outline-none focus:shadow-outline"
        rel="prefetch"
        href="users/{selectionUserId}?tab=user"
        variant={tab === TABS[0] ? "unelevated" : "outlined"}
      >
        <Icon class="material-icons">account_circle</Icon>
        <Label>{$_("text.user-profil")}</Label>
      </Button>
      <Button
        class="focus:outline-none focus:shadow-outline"
        rel="prefetch"
        href="users/{selectionUserId}?tab=mail"
        variant={tab === TABS[2] ? "unelevated" : "outlined"}
      >
        <Icon class="material-icons">mail</Icon>
        <Label>{$_("text.mail")}</Label>
      </Button>
    </Group>
    <div class="flex mr-2" class:hidden>
      <Button
        on:click={() => proxyEvent("INFO:token:Redirect")}
        disabled={!magicLink}
        variant="unelevated"
      >
        <Icon class="material-icons"
          >{(hasExpired && "link_off") || "link"}</Icon
        >
        <Label>Magic Link</Label>
      </Button>
    </div>
  </div>
  {#if tab === TABS[1]}
    <TimeManager {selectionUserId} />
  {/if}
  {#if tab === TABS[0]}
    <UserManager
      on:user:Redirect
      on:token:Generate
      on:token:Remove
      on:user:Activate
      on:open:InfoDialog
      {selectionUserId}
      selectedMode="edit"
    />
  {/if}
  {#if tab === TABS[2]}
    <MailManager {selectionUserId} {sentsData} {inboxData} />
  {/if}
</div>

<style>
  .user-grid {
    display: grid;
    grid-template-rows: var(--toolbar-h) auto;
    grid-gap: var(--grid-gap);
    align-items: center;
    overflow: hidden;
  }
  :global(.user).user-grid {
    grid-template-areas:
      "toolbar toolbar"
      "one two";
    grid-template-columns: 1fr;
  }
  :global(.time).user-grid {
    grid-template-areas:
      "toolbar toolbar"
      "one two";
    grid-template-columns: 4fr 4fr;
    align-items: initial;
  }
  :global(.mail).user-grid {
    grid-template-areas:
      "toolbar toolbar"
      "one one";
    grid-template-columns: 4fr 4fr;
    align-items: initial;
  }
  :global(.loggedin) .user-grid {
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
