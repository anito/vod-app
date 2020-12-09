<script>
  import { goto, stores } from "@sapper/app";
  import { UserManager, TimeManager } from "components";
  import { Header } from "@sveltejs/site-kit";
  import Button, { Group, Label, Icon } from "@smui/button";
  import IconButton from "@smui/icon-button";
  import Dialog, { Title, Content, Actions, InitialFocus } from "@smui/dialog";
  import { users } from "../../stores/userStore";
  import { onMount } from "svelte";

  const TABS = ["user", "time"];
  const { page, session } = stores();

  let redirectToUserDialog;
  let filtered;

  $: tab = ($page.query && $page.query.tab) || "time";
  $: selectionUserId = $page.params.slug;
  $: currentUser =
    (filtered = ((id) => $users.filter((usr) => usr.id === id))(
      selectionUserId
    )) &&
    filtered.length &&
    filtered[0];
  $: tab = ((t) => TABS.find((itm) => itm === t) || TABS[1])(tab);
  $: magicLink =
    (currentUser &&
      currentUser.token &&
      `http://${$page.host}/login?token=${currentUser.token.token}`) ||
    false;

  onMount(() => {});

  async function changeTab(tab) {
    const wait = await goto(`users/${selectionUserId}?tab=${tab}`);
    return false;
  }

  function dialogCloseHandler(e) {
    if (e.detail.action === "approved") {
    }
  }
</script>

<style>
  .grid {
    display: grid;
    grid-template-rows: var(--toolbar-h) auto;
    grid-gap: var(--grid-gap);
    height: calc(100% - var(--breadcrumb-h));
    align-items: center;
  }
  :global(.user).grid {
    grid-template-areas:
      "toolbar toolbar"
      "one two";
    grid-template-columns: 1fr;
  }
  :global(.time).grid {
    grid-template-areas:
      "toolbar toolbar"
      "one two";
    grid-template-columns: 4fr 4fr;
    align-items: initial;
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
  <title>Physiotherapy Online | User {currentUser.name}</title>
</svelte:head>

{#if 'Administrator' === $session.role}
  <div class="grid {tab}">
    <div class="grid-item toolbar justify-between">
      <Group variant="unelevated">
        <Button
          class="focus:outline-none focus:shadow-outline"
          on:click={() => changeTab(TABS[1])}
          variant={tab === TABS[1] ? 'unelevated' : 'outlined'}>
          <Icon class="material-icons">video_settings</Icon>
          <Label>Videokurse</Label>
        </Button>
        <Button
          class="focus:outline-none focus:shadow-outline"
          on:click={() => changeTab(TABS[0])}
          variant={tab === TABS[0] ? 'unelevated' : ''}>
          <Icon class="material-icons">account_circle</Icon>
          <Label>Benutzerdaten</Label>
        </Button>
      </Group>
      <div class="flex">
        {#if magicLink}
          <Button on:click={() => redirectToUserDialog.open()}>
            <IconButton>
              <Icon class="material-icons">swap_calls</Icon>
            </IconButton>
          </Button>
        {:else}
          <Icon
            class="material-icons"
            style="align-self: center; margin-right: 10px;">
            link_off
          </Icon>
        {/if}
        <Header mdc h="4" class="pr-6">{currentUser.name}</Header>
      </div>
    </div>
    {#if tab === TABS[1]}
      <TimeManager {selectionUserId} />
    {/if}
    {#if tab === TABS[0]}
      <UserManager
        on:openRedirectToUserDialog={() => redirectToUserDialog.open()}
        {selectionUserId}
        selectedMode="edit" />
    {/if}
  </div>
{:else}
  <UserManager {selectionUserId} selectedMode="edit" />
{/if}
<Dialog
  bind:this={redirectToUserDialog}
  aria-labelledby="event-title"
  aria-describedby="event-content"
  on:MDCDialog:closed={dialogCloseHandler}>
  <Title id="event-title">Jetzt als {currentUser.name} anmelden?</Title>
  <Content id="event-content">
    Möchten Sie die Seite verlassen und sich als
    <strong>{currentUser.name}</strong>
    anmelden?
    <div class="mt-5 mb-5">
      <details>
        <summary>Hinweis</summary>
        <p>
          Um später als
          <strong>{$session.user && $session.user.name}</strong>
          weiter zu arbeiten, müssen Sie sich erneut anmelden.
        </p>
      </details>
    </div>
  </Content>
  <Actions>
    <Button action="none">
      <Label>Abbrechen</Label>
    </Button>
    <Button variant="outlined" href={magicLink} target="_self">
      <Label class="token-button-label">Ja, Seite verlassen</Label>
    </Button>
  </Actions>
</Dialog>
