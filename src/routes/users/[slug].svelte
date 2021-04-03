<script>
  import { stores } from '@sapper/app';
  import { onMount } from 'svelte';
  import { UserManager, TimeManager } from 'components';
  import { Header } from '@sveltejs/site-kit';
  import Button, { Group, Label, Icon } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import { users } from '../../stores/userStore';
  import { post, proxyEvent } from 'utils';
  import { _ } from 'svelte-i18n';

  const TABS = ['user', 'time'];
  const { page, session } = stores();

  let expires;
  let hasExpired;
  let tokenVal;
  let magicLink;

  $: tab = ($page.query && $page.query.tab) || 'time';
  $: selectionUserId = $page.params.slug;
  $: currentUser = ((id) => $users.filter((usr) => usr.id === id))(selectionUserId)[0];
  $: tab = ((t) => TABS.find((itm) => itm === t) || TABS[1])(tab);
  $: ((user) => {
    if (!user) return;
    expires = user.expires;
    hasExpired = (expires && expires * 1000 < +new Date().getTime()) || false;
    tokenVal = user.token && user.token.token;
    magicLink = (tokenVal && `http://${$page.host}/login?token=${tokenVal}`) || false;
  })(currentUser);

  onMount(() => {
    extendSession();
  });

  async function extendSession() {
    const res = await post('auth/session', {});
    if (res) {
      proxyEvent('session:extend', { expires: res.expires });
    }
  }
</script>

<svelte:head>
  <title>Physiotherapy Online | User {currentUser && currentUser.name}</title>
</svelte:head>

{#if 'Administrator' === $session.role}
  <div class="grid {tab}">
    <div class="grid-item toolbar justify-between">
      <Group variant="unelevated">
        <Button
          class="focus:outline-none focus:shadow-outline"
          rel="prefetch"
          href="users/{selectionUserId}?tab=time"
          variant={tab === TABS[1] ? 'unelevated' : 'outlined'}
        >
          <Icon class="material-icons">video_settings</Icon>
          <Label>{$_('text.classes')}</Label>
        </Button>
        <Button
          class="focus:outline-none focus:shadow-outline"
          rel="prefetch"
          href="users/{selectionUserId}?tab=user"
          variant={tab === TABS[0] ? 'unelevated' : 'outlined'}
        >
          <Icon class="material-icons">account_circle</Icon>
          <Label>{$_('text.user-profil')}</Label>
        </Button>
      </Group>
      <div class="flex">
        {#if magicLink}
          <Button on:click={() => proxyEvent('INFO:token:Redirect')}>
            <IconButton>
              <Icon class="material-icons">
                {(hasExpired && 'link_off') || 'link'}
              </Icon>
            </IconButton>
          </Button>
        {:else}
          <Icon class="material-icons" style="align-self: center; margin-right: 10px;">link_off</Icon>
        {/if}
        <Header mdc h="5" class="pr-6 hidden md:block">{currentUser.name}</Header>
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
  </div>
{:else}
  <UserManager {selectionUserId} selectedMode="edit" />
{/if}

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
      'toolbar toolbar'
      'one two';
    grid-template-columns: 1fr;
  }
  :global(.time).grid {
    grid-template-areas:
      'toolbar toolbar'
      'one two';
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
