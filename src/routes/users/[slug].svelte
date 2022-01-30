<script>
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";
  import { UserManager, TimeManager, MailManager } from "components";
  import Button, { Group, Label, Icon } from "@smui/button";
  import { users } from "stores/userStore";
  import { proxyEvent, extendSession } from "utils";
  import { _ } from "svelte-i18n";

  const TABS = ["user", "time", "mail"];
  const { page, session } = stores();

  let userExpires;
  let hasExpired;
  let tokenVal;
  let magicLink;
  let currentUser;
  let username;

  $: tab = ($page.query && $page.query.tab) || "time";
  $: selectionUserId = $page.params.slug;
  $: (tab || selectionUserId) && extendSession();
  $: currentUser = ((id) =>
    $users.length && $users.filter((usr) => usr.id === id)[0])(selectionUserId);
  $: username = (currentUser && currentUser.name) || "";
  $: tab = ((t) => TABS.find((itm) => itm === t) || TABS[1])(tab);
  $: ((user) => {
    if (!user) return;
    userExpires = user.expires;
    hasExpired =
      (userExpires && userExpires * 1000 < +new Date().getTime()) || false;
    tokenVal = user.token && user.token.token;
    magicLink = tokenVal && `http://${$page.host}/login?token=${tokenVal}`;
  })(currentUser);
  $: hidden = $session.role !== 'Administrator' ? true : selectionUserId == $session.user.id ? true : false;

  onMount(() => {});
</script>

<svelte:head>
  <title>Physiotherapy Online | User {username}</title>
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
      <Button on:click={() => proxyEvent("INFO:token:Redirect")} disabled={!magicLink} variant="unelevated">
        <Icon class="material-icons">{(hasExpired && "link_off") || "link"}</Icon>
        <Label>Login</Label>
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
    <MailManager {selectionUserId} />
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
